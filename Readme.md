## Route Builder 🏃🚴
Ein minimalistischer, webbasierter Routenplaner, entwickelt mit Node.js und Leaflet. Die Anwendung ermöglicht es, interaktiv Wegpunkte auf einer Karte zu setzen. Sie berechnet automatisch den echten Weg über Straßen (Snap-to-Road), misst live die Distanz und erlaubt es, die fertigen Routen in einer lokalen Datenbank zu speichern sowie als hochpräzise GPX-Datei zu exportieren.
## Features ✨

* 🗺️ Echtes Straßen-Routing: Verbindet gesetzte Punkte automatisch entlang realer Straßen und Wege (mittels OSRM-API und intelligentem Luftlinien-Fallback).
* 📊 Live-Distanzanzeige: Berechnet bei jedem Klick dynamisch die exakte Streckenlänge in Kilometern (km) entlang des Straßenverlaufs.
* 🔍 Adresse- & Ortssuche: Integrierte Suchleiste (Komoot Photon Engine), um blitzschnell zu Städten oder Adressen zu springen.
* ↩️ Undo-Funktion: Ein Klick auf "Rückgängig" entfernt das letzte Wegsegment und korrigiert die Distanzanzeige sofort.
* 💾 Datenbank-Anbindung: Permanentes Speichern und Laden von Routen über eine leichtgewichtige, dateibasierte SQLite-Datenbank (routes.db).
* 💾 GPX-Export: Exportiert die gezeichnete Strecke als standardisierte .gpx-Datei für Garmin, Strava, Wahoo oder Komoot.

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
Du benötigst [Node.js](https://nodejs.org/) (Version 16 oder höher) auf deinem Computer installiert. [1] 
------------------------------
## Installation & Start 🚀
Folge diesen einfachen Schritten, um die App lokal auszuführen:
## 1. Projektordner erstellen und betreten

mkdir route-exporter
cd route-exporter

## 2. Dateien anlegen
Erstelle die Dateien server.js und index.html in diesem Ordner und kopiere den jeweiligen Quellcode hinein. [2] 
## 3. Abhängigkeiten installieren
Initialisiere das Projekt und installiere die benötigten Node.js-Pakete über dein Terminal:

npm init -y
npm install express sqlite3 axios

## 4. Anwendung starten
Starte den lokalen Server:

node server.js

## 5. Im Browser öffnen
Öffne nun deinen Webbrowser und rufe die folgende Adresse auf:
👉 http://localhost:3000
------------------------------
## Technologien 💻

* Backend: Node.js mit Express (Routing & statische Dateien)
* Datenbank: [SQLite](https://www.sqlite.org/) (via sqlite3 npm-Modul)
* Frontend: HTML5, CSS3, Modern JavaScript (ES6)
* Karten-Bibliothek: [Leaflet.js](https://leafletjs.com/) (OpenStreetMap-Kacheln)
* Routing-Engine: [OSRM API](http://project-osrm.org/) (Open Source Routing Machine)
* Geocoding (Suche): [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder) mit der Photon-Engine von Komoot

------------------------------
## Benutzungshinweise 💡

   1. Startpunkt setzen: Klicke irgendwo auf die Karte, um deinen Startpunkt festzulegen.
   2. Route zeichnen: Jeder weitere Klick sucht automatisch den Straßenweg von deinem letzten Punkt aus (momentan sollten die Punkte möglichst nebeneinander liegen, da sonst Luftlinie genommen wird).
   3. Suchen: Nutze das Lupen-Symbol oben rechts auf der Karte, um direkt zu einer bestimmten Adresse zu fliegen.
   4. Speichern: Gib der Route oben einen Namen und klicke auf "In DB Speichern". Sie erscheint sofort in der rechten Seitenleiste.
   5. Laden: Klicke in der rechten Seitenleiste auf eine gespeicherte Route, um sie wieder auf der Karte anzuzeigen.

------------------------------
## Lizenz 📄
Die genutzten APIs (OSRM, Photon) sind freie Demo-Server. Bei einer kommerziellen Nutzung oder sehr hoher Serverlast empfiehlt es sich, eine eigene OSRM-Instanz aufzusetzen.