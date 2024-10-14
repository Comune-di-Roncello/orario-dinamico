from django.shortcuts import render
from django.db.models import OuterRef, Subquery


from . import models

from datetime import datetime as dt

# Create your views here.
def home(request):
    #Lunedì 0 domenica 6
    day_of_week = 1
    day_of_week = dt.today().weekday()
    time_now = dt.now().time()
    now = time_now.hour*60+time_now.minute

    aperti = models.Orario.objects.filter(
        day_of_week=day_of_week
    )

    open_today = {}
    for apertura in aperti:
        open_time = apertura.time_start.hour*60+apertura.time_start.minute
        close_time = apertura.time_end.hour*60+apertura.time_end.minute
        

        if now < open_time:
            # Non ancora aperto
            minutes_to_open = open_time-now

            if minutes_to_open > 15:
                open_today.update({
                    apertura.fkufficio.name: {
                        "badge": "primary",
                        "text": f"Apre alle {apertura.time_start.strftime('%H:%M')}"
                    }
                })
            else:
                open_today.update({
                    apertura.fkufficio.name: {
                       "badge": "info",
                        "text": f"Apre tra {minutes_to_open} minuti"
                    }
                })
            
        elif now > close_time:
            # Già chiuso
            if now-close_time > 30:
                continue

            open_today.update({
                apertura.fkufficio.name: {
                    "badge": "danger",
                    "text": "Chiuso"
                }
            })

        else:
            # Aperto
            minutes_to_close = close_time-now
            if minutes_to_close < 15:
                open_today.update({
                    apertura.fkufficio.name: {
                        "badge": "warning",
                        "text": f"Chiude tra {minutes_to_close} minuti"
                    }
                })

            else:
                open_today.update({
                    apertura.fkufficio.name: {
                        "badge": "success",
                        "text": "Aperto"
                    }
                })

    open_this_week = models.Orario.objects.filter(pkid__in=Subquery(
        models.Ufficio.objects.annotate(
            first_open=Subquery(
                models.Orario.objects.filter(
                    fkufficio=OuterRef('pkid'), 
                    day_of_week__gt=day_of_week
                ).order_by('day_of_week', 'time_start').values('pkid')[:1]
            )
        ).values('first_open')
    ))
    
    open_next_week = models.Orario.objects.filter(pkid__in=Subquery(
        models.Ufficio.objects.annotate(
            first_open=Subquery(
                models.Orario.objects.filter(
                    fkufficio=OuterRef('pkid'), 
                    day_of_week__lt=day_of_week
                ).order_by('day_of_week', 'time_start').values('pkid')[:1]
            )
        ).values('first_open')
    ))

    filtered_next_week = open_next_week.exclude(fkufficio__pkid__in=Subquery(open_this_week.values('fkufficio__pkid')))

    output_openings = filtered_next_week.union(open_this_week, all=True)

    return render(request, "webpage/index.html", context = {"open_today": open_today, "next_open": output_openings})