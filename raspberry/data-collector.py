import time
import json
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTShadowClient
from aws_helpers.custom_shadow_helpers import customShadowCallback_Delete, customShadowCallback_Update


# from get_sensor_data.sensor_sgp30 import get_sensor_sgp30
from get_sensor_data.sensor_scd30 import get_sensor_scd30_co2, get_sensor_scd30_temp, get_sensor_scd30_rh
from get_sensor_data.sensor_enviro import get_sensor_pms5003
from get_sensor_data.sensor_enviro import get_sensor_nh3, get_sensor_ox, get_sensor_red
from get_sensor_data.sensor_zigbee import get_sensor_zigbee
from get_sensor_data.sensor_tado import get_sensor_heating


API_ENDPOINT = "abeqm7ntwv6xv-ats.iot.us-east-1.amazonaws.com"


# Init AWSIoTMQTTShadowClient
myAWSIoTMQTTShadowClient = AWSIoTMQTTShadowClient('PiClient')
myAWSIoTMQTTShadowClient.configureEndpoint(
    API_ENDPOINT, 8883)
myAWSIoTMQTTShadowClient.configureCredentials("/home/remote/iot/root-ca1.pem",
                                              "/home/remote/iot/private.pem.key", "/home/remote/iot/certificate.pem.crt")

# AWSIoTMQTTShadowClient connection configuration
myAWSIoTMQTTShadowClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTShadowClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTShadowClient.configureMQTTOperationTimeout(5)  # 5 sec

# Connect to AWS IoT
myAWSIoTMQTTShadowClient.connect()

# Create a device shadow handler, use this to update and delete shadow document
deviceShadowHandler = myAWSIoTMQTTShadowClient.createShadowHandlerWithName(
    "IAQ-Pi", True)

# Delete current shadow JSON doc
deviceShadowHandler.shadowDelete(customShadowCallback_Delete, 5)

# Read data from moisture sensor and update shadow
while True:
    zigbee = get_sensor_zigbee()
    particles = get_sensor_pms5003()
    temperature = zigbee["living-room-multi"]["temperature"]/100
    humidity = zigbee["living-room-multi"]["humidity"]/100
    co2 = get_sensor_scd30_co2()
    nh3 = get_sensor_nh3()
    ox = get_sensor_ox()
    red = get_sensor_red()
    pm1 = particles.pm_ug_per_m3(1)
    pm2 = particles.pm_ug_per_m3(2.5)
    pm10 = particles.pm_ug_per_m3(10)
    heating = get_sensor_heating()
    livingroom_door_open = zigbee["livingroom-door"]["open"]
    livingroom_window_open = zigbee["livingroom-window"]["open"]
    balcony_door_open = zigbee["balcony-door"]["open"]
    kitchen_window_open = zigbee["kitchen-window"]["open"]
    fallback_temperature = get_sensor_scd30_temp()
    fallback_humidity = get_sensor_scd30_rh()

    # Display moisture and temp readings
    print("Temperature: {}".format(temperature))
    print("Relative Humidity: {}".format(humidity))
    print("CO2 Level: {}".format(co2))
    print("NH3 Level: {}".format(nh3))
    print("OX Level: {}".format(ox))
    print("RED Level: {}".format(nh3))
    print("PM Level: {pm1} PM1, {pm2} PM2.5, {pm10} PM10".format(
        pm1=pm1, pm2=pm2, pm10=pm10))
    print("Heating Level: {}".format(heating))
    print("Livingroom door open: {}".format(livingroom_door_open))
    print("Livingroom window open: {}".format(livingroom_window_open))
    print("Balcony door open: {}".format(balcony_door_open))
    print("Kitchen window open: {}".format(kitchen_window_open))

    # Create message payload
    payload = {"state": {"reported": {
        "temperature": str(temperature), "humidity": str(humidity), "co2": str(co2), "nh3": str(nh3), "ox": str(ox),
        "red": str(red), "pm1": str(pm1), "pm2": str(pm2), "pm10": str(pm10), "heating": str(heating),
        "livingroom_door_open": str(livingroom_door_open), "livingroom_window_open": str(livingroom_window_open), "balcony_door_open": str(balcony_door_open),
        "kitchen_window_open": str(kitchen_window_open), "fallback_temperature": str(fallback_temperature), "fallback_humidity": str(fallback_humidity), }}}

    # Update shadow
    deviceShadowHandler.shadowUpdate(json.dumps(
        payload), customShadowCallback_Update, 5)
    time.sleep(10)
