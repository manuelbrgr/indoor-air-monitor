import requests
import os


base_url = "https://my.tado.com/api/v2/"


username = os.environ['TADO_USER']
password = os.environ['TADO_PASSWD']
home_id = os.environ['HOME_ID']
zone_id = os.environ['ZONE_ID']


def get_sensor_heating():
    response = requests.get(
        '{base_url}homes/{home_id}/zones/{zone_id}/state?username={username}&password={password}'.format(
            base_url=base_url, home_id=home_id, zone_id=zone_id, username=username, password=password))
    if (response.status_code == 200):
        return response.json()["activityDataPoints"]["heatingPower"]["percentage"]
    else:
        raise Exception("Response of Tado failed")
