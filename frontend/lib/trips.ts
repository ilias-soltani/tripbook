export const API_BASE = "http://localhost:8000/api/trips/";

export type Trip = {
  id: number;
  destination: string;
  start_date: string;
  end_date: string;
  price: string;
};

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

export const formatPrice = (price: string | number) => eur.format(Number(price));
