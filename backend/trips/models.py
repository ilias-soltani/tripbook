from django.db import models


class Trip(models.Model):
    destination = models.CharField(max_length=120)
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.destination
