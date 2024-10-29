# For simplicity, we'll read config file from 1st CLI param sys.argv[1]
import os
import json

import requests
import msal
from typing import Any
from datetime import datetime
from datetime import date
from datetime import timedelta

from . import models

# Optional logging
# logging.basicConfig(level=logging.DEBUG)

class O365Credentials(requests.Session):
    config = {
        "authority": "https://login.microsoftonline.com/" + os.getenv("TENANT_ID"),
        "client_id": os.getenv("CLIENT_ID"),
        "scope": ["https://graph.microsoft.com/.default"],
        "secret": os.getenv("SECRET"),
        "endpoint": "https://graph.microsoft.com/v1.0/users"
    }

    # Create a preferably long-lived app instance which maintains a token cache.
    app = msal.ConfidentialClientApplication(
        config["client_id"],
        authority=config.get("authority"),  # For Entra ID or External ID,
        # For External ID with custom domain
        # oidc_authority=config.get("oidc_authority"),
        client_credential=config["secret"],
        # token_cache=...  # Default cache is in memory only.
        # You can learn how to use SerializableTokenCache from
        # https://msal-python.rtfd.io/en/latest/#msal.SerializableTokenCache
    )
    token: dict[str | Any, Any | str] | Any | None

    def __init__(self):
        super().__init__()

    def get(self, url, *args, **kwargs):
        self._get_token()
        return super().get(url, *args, **kwargs)

    def _get_token(self):
        # token = self.app.acquire_token_silent(self.config["scope"], account=None)

        # if not token:
        result = self.app.acquire_token_for_client(scopes=self.config["scope"])

        self.headers.update(
            {'Authorization': 'Bearer ' + result['access_token']}
        )



def main():
    cred = O365Credentials()

    # Get ID of User from which to access calendars
    # TODO: make reslient in case network is down, retry forever
    r = cred.get("https://graph.microsoft.com/v1.0/users", params={"$filter": "userPrincipalName eq 'federico@ftabbo.onmicrosoft.com'"})
    assert r.ok

    filtered_users = r.json()
    user_id = filtered_users['value'][0]['id']

    # Get calendar ID
    r = cred.get(f"https://graph.microsoft.com/v1.0/users/{user_id}/calendars", params={"$filter": "name eq 'Orari Apertura'"})
    assert r.ok

    filtered_calendars = r.json()
    calendar_id = filtered_calendars['value'][0]['id']

    now = datetime.now()
    endtime = now + timedelta(days=15)

    # Get events for next 7 days
    r = cred.get(f"https://graph.microsoft.com/v1.0/users/{user_id}/calendars/{calendar_id}/calendarView",
                 params={"startDateTime": now.astimezone().replace(microsecond=0).isoformat(), "endDateTime": endtime.astimezone().replace(microsecond=0).isoformat()})
    
    assert r.ok

    outlookresponse = models.InputModel.model_validate(r.json())
    events = outlookresponse.value
    

    # Now we need to find all events happening today
    happening_today = []
    now = datetime.now()
    today = now.date()

    for x in events:
        if x.start.date() == today:
            happening_today.append(x)


    # Find set of names of events
    event_names = set()
    for x in events:
        event_names.add(x.subject)

    # Per every event name, find the closest to us that isn't today
    happening_later = []
    for name in event_names:
        try:
            happening_later.append(sorted([x for x in events if x.start.date() != today and x.subject == name], key=lambda d: d.start)[0])
        except IndexError:
            # Probably the only event was today
            continue

    output = models.OutputModel(
        today=happening_today,
        later=happening_later
    )

    with open("output.json", "w") as outfile:
        outfile.write(output.model_dump_json(indent=4))

    return happening_today, happening_later
    

if __name__ == '__main__':
    main()