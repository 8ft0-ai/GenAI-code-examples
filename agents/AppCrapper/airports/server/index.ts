
import { app } from './run_express';
import { initDB, getAirports } from './db';
import { calculateDistance } from './distance';
import { Airport, DistanceResponse } from '../shared/types';

initDB();

app.get('/api/airports', async (req, res) => {
  try {
    const airports = await getAirports();
    res.json(airports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/distance', async (req, res) => {
  const { from, to } = req.query;
  
  if (!from || !to) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  try {
    const airports = await getAirports();
    const airport1 = airports.find(a => a.code === from);
    const airport2 = airports.find(a => a.code === to);

    if (!airport1 || !airport2) {
      res.status(404).json({ error: 'Airport not found' });
      return;
    }

    const distance = calculateDistance(airport1, airport2);
    const response: DistanceResponse = { distance };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

