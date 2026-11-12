## Route Builder 🏃
Ein webbasierter Fußroutenplaner mit Node.js und Leaflet. Routen lassen sich über Start- und Zielorte oder durch Wegpunkte auf der Karte planen. Die App zeigt die Distanz an und ermöglicht das Speichern in einer lokalen Datenbank sowie den GPX-Export.
## Features ✨

* 🗺️ Fußweg-Routing: Verbindet gesetzte Wegpunkte über Straßen und Wege mithilfe des OpenStreetMap.de-Routingdienstes. Beim Zeichnen per Kartenklick wird bei einem Routingfehler eine Luftlinie verwendet.
* 📊 Live-Distanzanzeige: Berechnet bei jedem Klick dynamisch die exakte Streckenlänge in Kilometern (km) entlang des Straßenverlaufs.
* 🔍 Adresse- & Ortssuche: Integrierte Suchleiste (Komoot Photon Engine), um blitzschnell zu Städten oder Adressen zu springen.
* 📍 Start-Ziel-Planung: Start und Ziel als Ort oder Adresse eingeben. Die App wählt die kürzeste der vom Routingdienst gelieferten Fußrouten-Alternativen (keine Garantie für die global kürzeste Route).
* ⏳ Suchstatus: Fortschrittsanzeige bei der Start-Ziel-Suche, mit Hinweisen bei fehlenden Treffern oder einer zu lange dauernden Ortssuche.
* ↩️ Undo-Funktion: Ein Klick auf "Rückgängig" entfernt das letzte Wegsegment und korrigiert die Distanzanzeige sofort.
* 💾 Datenbank-Anbindung: Permanentes Speichern und Laden von Routen über eine leichtgewichtige, dateibasierte SQLite-Datenbank (routes.db).
* 💾 GPX-Export: Exportiert die aktuelle Strecke als standardisierte .gpx-Datei für Garmin, Strava, Wahoo oder Komoot.

------------------------------
## Projektstruktur 📁

route-exporter/
├── node_modules/          # Installierte Node.js Pakete
├── routes.db              # SQLite-Datenbank (wird beim ersten Start automatisch erstellt)
├── osrm_error.html        # Temporäre Debugging-Datei für API-Fehler (falls vorhanden)
├── server.js              # Express Backend & API-Logik
├── index.html             # Leaflet Frontend & Benutzeroberfläche
└── package.json           # Projektspezifikationen & Abhängigkeiten

------------------------------
## Voraussetzungen 🛠️
Du benötigst [Node.js](https://nodejs.org/) (Version 18 oder höher) auf deinem Computer installiert. Für die Playwright-Tests wird Node.js 20 oder neuer benötigt.
------------------------------
## Installation & Start 🚀
Folge diesen einfachen Schritten, um die App lokal auszuführen:
## 1. Projektordner erstellen und betreten

mkdir route-exporter
cd route-exporter

## 2. Projektdateien bereitstellen
Klone das Repository oder lege mindestens `server.js`, `index.html` und `package.json` im Projektordner ab.
## 3. Abhängigkeiten installieren
Installiere die im Projekt hinterlegten Abhängigkeiten über dein Terminal:

npm install

## 4. Anwendung starten
Starte den lokalen Server:

node server.js

## 5. Im Browser öffnen
Öffne nun deinen Webbrowser und rufe die folgende Adresse auf:
👉 http://localhost:3000
------------------------------
## Tests 🧪

Installiere nach `npm install` einmalig den Playwright-Browser und führe danach die End-to-End-Tests aus:

```bash
npx playwright install chromium
npm test
```

Die Tests verwenden simulierte Geocoding- und Routingantworten sowie eine isolierte In-Memory-Datenbank. Die gespeicherten Routen in `routes.db` bleiben dabei unverändert. Die echten öffentlichen Geocoding- und Routingdienste werden durch diese Tests nicht geprüft.

------------------------------
## Technologien 💻

* Backend: Node.js mit Express (Routing & statische Dateien)
* Datenbank: [SQLite](https://www.sqlite.org/) (via sqlite3 npm-Modul)
* Frontend: HTML5, CSS3, Modern JavaScript (ES6)
* Karten-Bibliothek: [Leaflet.js](https://leafletjs.com/) (OpenStreetMap-Kacheln)
* Routing-Engine: [OpenStreetMap.de routed-foot](https://routing.openstreetmap.de/) (OSRM-basiertes Fußweg-Routing)
* Geocoding (Suche): [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder) mit der Photon-Engine von Komoot

------------------------------
## Benutzungshinweise 💡

   1. Start-Ziel-Route: Gib Start- und Zielort in die Felder ein und klicke auf „Kürzeste gefundene Route“. Photon löst die Ortsnamen auf; die Fortschrittsanzeige zeigt die Suche und Routenberechnung an. Bei keinem Treffer oder einer zu lange dauernden Suche erscheint ein Hinweis. Falls der Routingdienst Alternativen liefert, wird die kürzeste davon gewählt. Das ist keine Garantie für die global kürzeste Strecke.
   2. Route per Karte zeichnen: Klicke auf den Startpunkt und danach auf Zwischenziele. Für jedes weitere Wegpunkt-Paar berechnet die App einen Fußweg. Schlägt das Routing fehl, wird für das Zeichnen per Karte eine Luftlinie verwendet.
   3. Rundwanderweg als GPX: Setze den Startpunkt und die gewünschten Zwischenziele per Kartenklick. Klicke am Ende erneut auf den Startpunkt, damit die Runde geschlossen wird. Klicke anschließend auf „Als GPX exportieren“.
   4. Suchen: Nutze das Lupen-Symbol oben rechts auf der Karte, um direkt zu einer bestimmten Adresse zu springen.
   5. Speichern und Laden: Gib der Route einen Namen und klicke auf „In DB Speichern“. Sie erscheint in der rechten Seitenleiste. Ein Klick auf eine gespeicherte Route lädt sie wieder auf die Karte.
   6. GPX-Export: Exportiert die aktuell angezeigte Route. Die Start-Ziel-Planung erzeugt eine einfache Strecke; für einen Rundwanderweg nutze die Wegpunkte auf der Karte und schließe die Runde wie oben beschrieben.

------------------------------
## Lizenz 📄
Die genutzten Dienste (OpenStreetMap.de routed-foot und Photon) werden öffentlich bereitgestellt und können zeitweise langsam oder nicht verfügbar sein. Bei kommerzieller Nutzung oder hoher Auslastung sollte ein eigener Routingdienst eingesetzt werden.