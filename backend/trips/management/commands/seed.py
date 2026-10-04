from datetime import date
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from trips.models import Trip

TRIPS = [
    {
        "destination": "Lisbon, Portugal",
        "start_date": date(2027, 3, 12),
        "end_date": date(2027, 3, 17),
        "price": Decimal("890.00"),
        "notes": "Tram 28 through Alfama, pastel de nata in Belém, day trip to Sintra.",
    },
    {
        "destination": "Prague, Czech Republic",
        "start_date": date(2027, 4, 22),
        "end_date": date(2027, 4, 26),
        "price": Decimal("640.50"),
        "notes": "Old Town Square, Charles Bridge at sunrise, Prague Castle, local pilsner.",
    },
    {
        "destination": "Barcelona, Spain",
        "start_date": date(2027, 6, 5),
        "end_date": date(2027, 6, 12),
        "price": Decimal("1250.00"),
        "notes": "Sagrada Família tickets booked, Park Güell, tapas in El Born, beach day.",
    },
    {
        "destination": "Amsterdam, Netherlands",
        "start_date": date(2027, 9, 17),
        "end_date": date(2027, 9, 21),
        "price": Decimal("980.75"),
        "notes": "Canal cruise, Rijksmuseum, Van Gogh Museum, bike rental in Vondelpark.",
    },
    {
        "destination": "Florence, Italy",
        "start_date": date(2027, 10, 8),
        "end_date": date(2027, 10, 14),
        "price": Decimal("1480.00"),
        "notes": "Uffizi Gallery, climb the Duomo, Tuscan day trip, bistecca alla fiorentina.",
    },
]


class Command(BaseCommand):
    help = "Delete all trips and insert example European trips."

    @transaction.atomic
    def handle(self, *args, **options):
        Trip.objects.all().delete()
        Trip.objects.bulk_create(Trip(**data) for data in TRIPS)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(TRIPS)} trips."))
