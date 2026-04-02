export const getWeather = async (city: string) => {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=fr&format=json`;

  const geo = await fetch(geoUrl).then((r) => r.json());

  if (!geo.results?.length) {
    throw new Error("Ville introuvable");
  }

  const { latitude, longitude, name, country } = geo.results[0];

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`;

  const weather = await fetch(weatherUrl).then((r) => r.json());

  const temp = weather.current.temperature_2m;

  return `Météo à ${name} (${country}) : ${temp}°C`;
};