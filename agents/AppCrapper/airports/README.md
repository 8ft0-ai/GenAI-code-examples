
# Australian Airport Distance App

This is a full stack TypeScript app that allows users to select major airports in Australia and see the distance between them on a map.

## Routes

- `/` - Renders the main app page with the airport selection and map
- `/api/airports` - Returns a list of major airports in Australia
- `/api/distance` - Given two airport codes, returns the distance between them in kilometers

## Libraries Used

- Backend:
  - Node.js
  - Express.js 
  - SQLite3
- Frontend:  
  - React 18
  - Leaflet (mapping library)
  - Axios (HTTP client)

## Running the App

To run the app, simply execute:

```
bun server/run.ts
```

This will start the server on port 8001. Open http://localhost:8001 in your browser to use the app.

The backend and frontend are both implemented in TypeScript. The backend uses SQLite for the database to store airport information. The frontend is a React app that communicates with the backend API to fetch data and render the UI.

