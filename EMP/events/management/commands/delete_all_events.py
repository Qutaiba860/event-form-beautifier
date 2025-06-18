from django.core.management.base import BaseCommand
from events.models import Event

class Command(BaseCommand):
    help = 'Deletes all events from the database'

    def handle(self, *args, **kwargs):
        total = Event.objects.count()
        confirm = input(f"Are you sure you want to delete all {total} events? Type 'yes' to confirm: ")

        if confirm.lower() == 'yes':
            Event.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f"Deleted {total} events from the database."))
        else:
            self.stdout.write(self.style.WARNING("Operation cancelled. No events were deleted."))