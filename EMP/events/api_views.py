from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from events.models import Event
from budget.models import Budget
from datetime import datetime

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
    except ValueError:
        return None

def parse_time(time_str):
    try:
        return datetime.strptime(time_str, "%H:%M").time() if time_str else None
    except ValueError:
        return None

@api_view(['POST'])
def submit_event(request):
    try:
        data = request.data

        event = Event.objects.create(
            name=data.get('name', ''),
            start_date=parse_date(data.get('start_date', '')),
            end_date=parse_date(data.get('end_date', '')),
            start_time=parse_time(data.get('start_time', '')),
            end_time=parse_time(data.get('end_time', '')),
            description=data.get('description', ''),
            host=data.get('host', ''),
            venue=data.get('venue', ''),
            location=data.get('location', ''),
            category=data.get('category', ''),
            department=data.get('department', ''),
            goals=data.get('goals', ''),
            expected_attendees=data.get('expected_attendees', None),
            status='Pending',
        )

        budget_items = data.get('budget_items', [])
        for item in budget_items:
            Budget.objects.create(
                item_name=item.get('name', ''),
                item_quantity=int(item.get('quantity', 1)),
                item_cost=float(item.get('price', 0)),
                total_cost=float(item.get('total_price', 0)),
                budget_status='Pending',
                event=event
            )

        return Response({"message": "Event created successfully."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)