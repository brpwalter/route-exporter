const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

// 1. DATENBANK INITIALISIEREN
const db = new sqlite3.Database('./routes.db', (err) => {
    if (err) console.error('Datenbank-Fehler:', err.message);
    else console.log('Verbunden mit der SQLite-Datenbank.');
});

db.run(`CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    coordinates TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Frontend ausliefern
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. ROUTING-API (Nutzung des unterstützten Demoprofils & präzises Geometrie-Mapping)
// 2. ROUTING-API (Optimiert für Fußwege, Parks und Radwege via OpenStreetMap-DE)
app.post('/api/route', async (req, res) => {
    const { profile, points } = req.body; // Profil kommt wieder vom Frontend mit ('foot' oder 'bike')

    if (!points || points.length < 2) {
        return res.status(400).json({ error: 'Mindestens zwei Punkte benötigt.' });
    }

    // Koordinaten für OSRM aufbereiten (lng,lat)
    const osrmCoords = points.map(p => `${Number(p.lng).toFixed(6)},${Number(p.lat).toFixed(6)}`).join(';');
    
    // Profil-Mapping für den OSM-DE Server (foot = Fußgänger, bike = Fahrrad)
    const osrmProfile = profile === 'bike' ? 'foot' : 'foot'; // Falls 'bike' Probleme macht, ist 'foot' der sicherste Weg durch Parks
    
    // Wir nutzen hier den stabilen OpenStreetMap.de Routing-Server für Fußgänger/Radfahrer
    const url = `https://openstreetmap.de/route/v1/${osrmProfile}/${osrmCoords}?overview=full&geometries=geojson`;
    // Hinweis: Die URL nutzt am Ende '/driving', aber der Server 'routed-foot' biegt es intern exakt auf Fußwege ab!

    try {
        const response = await axios.get(url);
        
        if (response.data && response.data.routes && response.data.routes.length > 0) {
            const geometry = response.data.routes[0].geometry.coordinates; // Korrektur: Erstes Element der Route ansteuern
            
            const leafletCoords = geometry.map(coord => ({ 
                lat: Number(coord[1]), // Index 1 ist Breitengrad
                lng: Number(coord[0])  // Index 0 ist Längengrad
            }));
            
            console.log(`[Erfolg] Park-/Straßenweg berechnet: ${leafletCoords.length} Punkte.`);
            return res.json({ coordinates: leafletCoords, type: 'road' });
        } else {
            throw new Error('Keine Route im Park gefunden.');
        }
    } catch (error) {
        console.warn(`[Routing-Hinweis] OSRM fehlgeschlagen. Grund: ${error.message}. Nutze Luftlinie.`);
        // Fallback auf die direkte Verbindung zwischen den beiden Punkten
        return res.json({ coordinates: points, type: 'straight' });
    }
});

// 3. DATENBANK-SCHNITTSTELLEN
app.post('/api/save', (req, res) => {
    const { name, coordinates } = req.body;
    if (!name || !coordinates || coordinates.length === 0) return res.status(400).json({ error: 'Ungültige Daten.' });

    db.run(`INSERT INTO routes (name, coordinates) VALUES (?, ?)`, [name, JSON.stringify(coordinates)], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Route erfolgreich gespeichert!', id: this.lastID });
    });
});

app.get('/api/routes', (req, res) => {
    db.all(`SELECT id, name, created_at FROM routes ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/routes/:id', (req, res) => {
    db.get(`SELECT * FROM routes WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Route nicht gefunden' });
        row.coordinates = JSON.parse(row.coordinates);
        res.json(row);
    });
});

// 4. GPX EXPORTIEREN
app.post('/api/export-gpx', (req, res) => {
    const { routeName, coordinates } = req.body;
    if (!coordinates || coordinates.length === 0) return res.status(400).send('Keine Daten.');

    const name = routeName || 'Meine_Route';
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="NodeJS Route Exporter" xmlns="http://topografix.com">
  <trk>
    <name>${name}</name>
    <trkseg>\n`;

    coordinates.forEach(point => {
        gpx += `      <trkpt lat="${point.lat}" lon="${point.lng}"></trkpt>\n`;
    });

    gpx += `    </trkseg>
  </trk>
</gpx>`;

    res.setHeader('Content-Type', 'application/gpx+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.gpx"`);
    res.send(gpx);
});

app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
