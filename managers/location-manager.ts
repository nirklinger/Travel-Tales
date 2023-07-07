import { config, geocoding, geolocation, coordinates, data, staticMaps } from '@maptiler/client';
config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

export async function findAddress(address: string) {
  return await geocoding.forward(address);
}
