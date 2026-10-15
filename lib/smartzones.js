const fetch = require('node-fetch');
const localSmartzones = require('../public/smartzones.json');

require('dotenv').config()

const apiUrl = process.env.API_URL;

// Fallback data for when the Coding the Curbs API is unreachable (it has been taken offline).
// Converts public/smartzones.json to the same shape the API used to return.
const fallbackSmartzones = localSmartzones.map((zone) => ({
  id: String(zone.smartzoneId),
  name: zone.name.trim(),
  town: zone.town.trim(),
  address: zone.location.trim(),
  utilization: [zone.function, zone.function1, zone.function2]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .map((value) => (value === 'parkeren' ? 'parking' : value)),
  size: zone.size.replace(' plek', '').replace(',', '.'),
  image: [{ url: zone.image, originalAsWebP: zone.image }],
  geolocation: { latitude: zone.lat, longitude: zone.lon },
}));

async function getSmartzones(orderBy = 'publishedAt') {
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/smartzones?first=100&orderBy=${encodeURIComponent(orderBy)}&direction=ASC`, { timeout: 5000 });
      const data = await response.json();
      if (Array.isArray(data.smartzones)) return data.smartzones;
    } catch (error) {
      console.error('Smartzones API unavailable, using local data:', error.message);
    }
  }

  const smartzones = [...fallbackSmartzones];
  if (orderBy === 'name') smartzones.sort((a, b) => a.name.localeCompare(b.name));
  return smartzones;
}

module.exports = { getSmartzones };
