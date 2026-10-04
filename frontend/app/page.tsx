"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getCityInfo } from "@/lib/city";
import { API_BASE, formatPrice, type Trip } from "@/lib/trips";

function TripCard({ trip }: { trip: Trip }) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCityInfo(trip.destination).then((info) => {
      if (!cancelled) setImage(info?.image ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [trip.destination]);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="h-48 w-full bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-700 dark:to-zinc-900">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={trip.destination} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{trip.destination}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {trip.start_date} → {trip.end_date}
        </p>
        <p className="mt-2 font-medium">{formatPrice(trip.price)}</p>
      </div>
    </Link>
  );
}

const inputClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTrips(await res.json());
      setLoadError(null);
    } catch {
      setLoadError("Could not load trips.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTrips();
  }, [loadTrips]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          start_date: startDate,
          end_date: endDate,
          price,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDestination("");
      setStartDate("");
      setEndDate("");
      setPrice("");
      await loadTrips();
    } catch {
      setSubmitError("Could not create the trip.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Trips</h1>

      <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3">
        <input
          className={inputClass}
          placeholder="Destination"
          aria-label="Destination"
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          className={inputClass}
          type="date"
          aria-label="Start date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className={inputClass}
          type="date"
          aria-label="End date"
          required
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          className={inputClass}
          type="number"
          step="0.01"
          min="0"
          placeholder="Price (EUR)"
          aria-label="Price"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {submitting ? "Adding…" : "Add trip"}
        </button>
      </form>

      {submitError && <p className="mb-4 text-sm text-red-600">{submitError}</p>}
      {loadError && <p className="mb-4 text-sm text-red-600">{loadError}</p>}
      {!loadError && trips.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">No trips yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </main>
  );
}
