import time
import json
from datetime import datetime
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTShadowClient
from aws_helpers.custom_shadow_helpers import customShadowCallback_Delete, customShadowCallback_Update

# from get_sensor_data.sensor_sgp30 import get_sensor_sgp30
from get_sensor_data.sensor_scd30 import get_sensor_scd30_co2, get_sensor_scd30_temp
from get_sensor_data.sensor_sgp30 import get_sensor_sgp30_tvoc, get_sensor_sgp30_eco2
from get_sensor_data.sensor_enviro import get_sensor_pms5003
from get_sensor_data.sensor_enviro import get_gas_sensor
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
    try:
        zigbee = get_sensor_zigbee()
        particles = get_sensor_pms5003()
        temperature = zigbee["living-room-multi"]["temperature"]/100
        fallback_temp = round(get_sensor_scd30_temp(), 2)
        humidity = zigbee["living-room-multi"]["humidity"]/100
        pressure = zigbee["living-room-multi"]["pressure"]
        temperature_outdoor = zigbee["balcony-multi"]["temperature"]/100
        humidity_outdoor = zigbee["balcony-multi"]["humidity"]/100
        pressure_outdoor = zigbee["balcony-multi"]["pressure"]
        co2 = round(get_sensor_scd30_co2(), 2)
        gas = get_gas_sensor()
        nh3 = round(gas.nh3 / 1000, 2)
        ox = round(gas.oxidising / 1000, 2)
        red = round(gas.reducing / 1000, 2)
        pm1 = particles.pm_ug_per_m3(1)
        pm2 = particles.pm_ug_per_m3(2.5)
        pm10 = particles.pm_ug_per_m3(10)
        heating = get_sensor_heating()
        tvoc = get_sensor_sgp30_tvoc()
        eco2 = get_sensor_sgp30_eco2()
        livingroom_door_open = zigbee["livingroom-door"]["open"]
        livingroom_window_open = zigbee["livingroom-window"]["open"]
        balcony_door_open = zigbee["balcony-door"]["open"]
        kitchen_window_open = zigbee["kitchen-window"]["open"]

        # Display moisture and temp readings
        print("Temperature: {}".format(temperature))
        print("Fallback Temp: {}".format(fallback_temp))
        print("Relative Humidity: {}".format(humidity))
        print("Pressure: {}".format(pressure))
        print("Temperature Outdoor: {}".format(temperature_outdoor))
        print("Relative Humidity Outdoor: {}".format(humidity_outdoor))
        print("Pressure Outdoor: {}".format(pressure_outdoor))
        print("CO2 Level: {}".format(co2))
        print("NH3 Level: {}".format(nh3))
        print("OX Level: {}".format(ox))
        print("RED Level: {}".format(red))
        print("PM Level: {pm1} PM1, {pm2} PM2.5, {pm10} PM10".format(
            pm1=pm1, pm2=pm2, pm10=pm10))
        print("Heating Level: {}".format(heating))
        print("TVOC Level: {}".format(tvoc))
        print("eCO2 Level: {}".format(eco2))
        print("Livingroom door open: {}".format(livingroom_door_open))
        print("Livingroom window open: {}".format(livingroom_window_open))
        print("Balcony door open: {}".format(balcony_door_open))
        print("Kitchen window open: {}".format(kitchen_window_open))

        # Create message payload
        payload = {"state": {"reported": {
            "temperature": temperature, "fallback_temp": fallback_temp, "humidity": humidity, "pressure": pressure, "temperature_outdoor": temperature_outdoor,
            "humidity_outdoor": humidity_outdoor, "pressure_outdoor": pressure_outdoor, "co2": co2, "nh3": nh3, "ox": ox,
            "red": red, "pm1": pm1, "pm2": pm2, "pm10": pm10, "heating": heating, "tvoc": tvoc, "eco2": eco2,
            "livingroom_door_open": livingroom_door_open, "livingroom_window_open": livingroom_window_open, "balcony_door_open": balcony_door_open,
            "kitchen_window_open": kitchen_window_open, "timestamp": datetime.now().isoformat()[:-3]+'Z'}}}

        # Update shadow
        deviceShadowHandler.shadowUpdate(json.dumps(
            payload), customShadowCallback_Update, 5)
    except ValueError:
        print("Something went wrong while trying to create the payload")

    time.sleep(10)
