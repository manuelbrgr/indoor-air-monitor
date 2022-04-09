import requests

base_url = "http://192.168.178.102:8080/api/"
gateway_id = "5DE7E3F579"


def get_sensor_data_object(json):
    response = {}
    for attr, value in json.items():
        if value["name"] in response.keys():
            response[value["name"]] |= value["state"]
        else:
            response[value["name"]] = value["state"]
    return response


def get_sensor_zigbee():
    response = requests.get(
        '{base_url}{gateway_id}/sensors'.format(base_url=base_url, gateway_id=gateway_id))
    if (response.status_code == 200):
        return get_sensor_data_object(response.json())
    else:
        raise Exception("Response of Zigbee gateway failed")
