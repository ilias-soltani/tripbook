"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getCityInfo, type CityInfo } from "@/lib/city";
import { API_BASE, formatPrice, type Trip } from "@/lib/trips";

type State =
  | { status: "loading" }
  | { status: "notfound" }
  | { status: "error" }
  | { status: "ready"; trip: Trip; city: CityInfo | null };

function nightsBetween(start: string, end: string) {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  return Math.round((Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) / 86_400_000);
}

const backLink = (
  <Link href="/" className="text-sm underline">
    ← All trips
  </Link>
);

export default function TripPage({ params }: PageProps<"/trips/[id]">) {
  const { id } = use(params);
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}${id}/`);
        if (res.status === 404) {
          if (!cancelled) setState({ status: "notfound" });
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const trip: Trip = await res.json();
        const city = await getCityInfo(trip.destination);
        if (!cancelled) setState({ status: "ready", trip, city });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return <main className="mx-auto w-full max-w-3xl px-4 py-10">Loading…</main>;
  }
  if (state.status !== "ready") {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10">
        <p>
          {state.status === "notfound" ? "Trip not found." : "Could not load this trip."}
        </p>
        {backLink}
      </main>
    );
  }

  const { trip, city } = state;
  const nights = nightsBetween(trip.start_date, trip.end_date);

  return (
    <main className="w-full">
      {city?.image ? (
        <div className="relative h-[50vh] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={city.image}
            alt={trip.destination}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-4 pb-8 text-white">
            <h1 className="text-4xl font-semibold">{trip.destination}</h1>
            {city.tagline && <p className="mt-1 text-lg capitalize">{city.tagline}</p>}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
        {backLink}
        {!city?.image && <h1 className="text-4xl font-semibold">{trip.destination}</h1>}

        <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <p>
            {trip.start_date} → {trip.end_date}
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            {nights} {nights === 1 ? "night" : "nights"}
          </p>
          <p className="mt-2 text-lg font-medium">{formatPrice(trip.price)}</p>
        </section>

        {city && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">About {trip.destination}</h2>
            <p>{city.summary}</p>
            {city.lat != null && city.lon != null && (
              <a
                className="inline-block underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.openstreetmap.org/?mlat=${city.lat}&mlon=${city.lon}#map=11/${city.lat}/${city.lon}`}
              >
                Open in maps
              </a>
            )}
            <p className="text-xs text-zinc-500">
              Source:{" "}
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(city.name.replaceAll(" ", "_"))}`}
              >
                Wikipedia
              </a>
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
