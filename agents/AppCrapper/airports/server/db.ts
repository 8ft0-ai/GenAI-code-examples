
import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database(':memory:');

export function initDB() {
  db.serialize(() => {
    db.run(`CREATE TABLE airports (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    )`);

    const airports = [
      { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', latitude: -33.9399, longitude: 151.1753 },
      { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', latitude: -37.6690, longitude: 144.8410 },
      { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', latitude: -27.3942, longitude: 153.1218 },
      { code: 'PER', name: 'Perth Airport', city: 'Perth', latitude: -31.9385, longitude: 115.9672 },
      { code: 'ADL', name: 'Adelaide Airport', city: 'Adelaide', latitude: -34.9461, longitude: 138.5299 },
    ];

    const stmt = db.prepare(`INSERT INTO airports (code, name, city, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?)`);
    
    for (const airport of airports) {
      stmt.run(airport.code, airport.name, airport.city, airport.latitude, airport.longitude);
    }

    stmt.finalize();
  });
}

export function getAirports() {
  return new Promise<Airport[]>((resolve, reject) => {
    db.all('SELECT * FROM airports', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

