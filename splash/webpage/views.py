from django.shortcuts import render

from . import models

from datetime import datetime as dt

# Create your views here.
def home(request):
    #Lunedì 0 domenica 6
    day_of_week = dt.today().weekday()
    time_now = dt.now().time()
    now = time_now.hour*60+time_now.minute

    aperti = models.Orario.objects.filter(
        day_of_week=day_of_week
    )

    open_today = []
    for apertura in aperti:
        open_time = apertura.time_start.hour*60+apertura.time_start.minute
        close_time = apertura.time_end.hour*60+apertura.time_end.minute
        
        this_open = {
            "name": apertura.fkufficio.name,
        }

        if now < open_time:
            # Non ancora aperto
            minutes_to_open = open_time-now

            if minutes_to_open > 15:
                this_open.update({
                    "badge": "primary",
                    "text": f"Apre alle {apertura.time_start.strftime('%H:%M')}"
                })
            else:
                this_open.update({
                    "badge": "info",
                    "text": f"Apre tra {minutes_to_open} minuti"
                })

        elif now > close_time:
            # Già chiuso
            if now-close_time > 30:
                continue

            this_open.update({
                "badge": "danger",
                "text": "Chiuso"
            })
            
        else:
            # Aperto
            minutes_to_close = close_time-now
            if minutes_to_close < 15:
                this_open.update({
                    "badge": "warning",
                    "text": f"Chiude tra {minutes_to_close} minuti"
                })
            else:
                this_open.update({
                    "badge": "success",
                    "text": "Aperto"
                })

        open_today.append(this_open)


    return render(request, "webpage/index.html", context = {"open_today": open_today})