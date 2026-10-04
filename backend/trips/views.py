from rest_framework import viewsets

from .models import Trip
from .serializers import TripSerializer


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.order_by("start_date")
    serializer_class = TripSerializer
