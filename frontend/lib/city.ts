export type CityInfo = {
  name: string;
  tagline: string | null;
  summary: string;
  image: string | null;
  lat: number | null;
  lon: number | null;
};

const cache = new Map<string, Promise<CityInfo | null>>();

async function fetchCityInfo(name: string): Promise<CityInfo | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === "disambiguation") return null;
    return {
      name: data.title,
      tagline: data.description ?? null,
      summary: data.extract ?? "",
      image: data.originalimage?.source ?? data.thumbnail?.source ?? null,
      lat: data.coordinates?.lat ?? null,
      lon: data.coordinates?.lon ?? null,
    };
  } catch {
    return null;
  }
}

export function getCityInfo(name: string): Promise<CityInfo | null> {
  const key = name.toLowerCase();
  let entry = cache.get(key);
  if (!entry) {
    entry = fetchCityInfo(name);
    cache.set(key, entry);
  }
  return entry;
}
