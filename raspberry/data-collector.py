import time
import json
from datetime import datetime
from utils.to_csv import csv_to_json, create_csv_file, to_csv_append
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTShadowClient
from aws_helpers.custom_shadow_helpers import customShadowCallback_Delete, customShadowCallback_Update

# from get_sensor_data.sensor_sgp30 import get_sensor_sgp30
from get_sensor_data.sensor_scd30 import get_sensor_scd30_co2, get_sensor_scd30_temp, get_sensor_scd30_rh
from get_sensor_data.sensor_sgp30 import get_sensor_sgp30_tvoc, get_sensor_sgp30_eco2
from get_sensor_data.sensor_enviro import get_sensor_pms5003
from get_sensor_data.sensor_enviro import get_gas_sensor
from get_sensor_data.sensor_zigbee import get_sensor_zigbee
from get_sensor_data.sensor_tado import get_sensor_heating

API_ENDPOINT = "abeqm7ntwv6xv-ats.iot.us-east-1.amazonaws.com"
HISTORY_DATA_PATH = "/home/remote/iot/15min.csv"
PREDICTION_DATA_PATH = "/home/remote/iot/prediction.json"

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

create_csv_file(HISTORY_DATA_PATH)

# Read data from moisture sensor and update shadow
while True:
    try:
        predictions_file = open(PREDICTION_DATA_PATH)
        predictions = json.load(predictions_file)
        zigbee = get_sensor_zigbee()
        particles = get_sensor_pms5003()
        temperature = zigbee["living-room-multi"]["temperature"]/100
        humidity = zigbee["living-room-multi"]["humidity"]/100
        rtemperature = round(get_sensor_scd30_temp(), 2)
        rhumidity = round(get_sensor_scd30_rh(), 2)
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
        co2_prediction = predictions["co2_prediction"]

        # Display moisture and temp readings
        print("Temperature: {}".format(temperature))
        print("Relative Humidity: {}".format(humidity))
        print("Realtime Temperature: {}".format(rtemperature))
        print("Realtime Humidity: {}".format(rhumidity))
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
        print("Prediction CO2: {}".format(co2_prediction))

        # Create message payload
        payload = {"state": {"reported": {
            "temperature": temperature, "humidity": humidity, "rtemperature": rtemperature, "rhumidity": rhumidity, "pressure": pressure, "temperature_outdoor": temperature_outdoor,
            "humidity_outdoor": humidity_outdoor, "pressure_outdoor": pressure_outdoor, "co2": co2, "nh3": nh3, "ox": ox,
            "red": red, "pm1": pm1, "pm2": pm2, "pm10": pm10, "heating": heating, "tvoc": tvoc, "eco2": eco2,
            "livingroom_door_open": livingroom_door_open, "livingroom_window_open": livingroom_window_open, "balcony_door_open": balcony_door_open,
            "kitchen_window_open": kitchen_window_open, "prediction_co2": co2_prediction, "timestamp": datetime.now().isoformat()[:-3]+'Z'}}}

        to_csv_append(payload["state"]["reported"], HISTORY_DATA_PATH, 180)

        # Update shadow
        deviceShadowHandler.shadowUpdate(json.dumps(
            payload), customShadowCallback_Update, 5)
    except:
        print("Something went wrong while trying to create the payload")

    time.sleep(10)
