import time
import json
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTShadowClient
from aws_helpers.custom_shadow_helpers import customShadowCallback_Delete, customShadowCallback_Update


from get_sensor_data.sensor_sgp30 import get_sensor_sgp30
from get_sensor_data.sensor_scd30 import get_sensor_scd30_co2, get_sensor_scd30_temp, get_sensor_scd30_humidity
from get_sensor_data.sensor_enviro import get_sensor_pms5003
from get_sensor_data.sensor_enviro import get_sensor_gas
from get_sensor_data.sensor_zigbee import get_sensor_zigbee
from get_sensor_data.sensor_tado import get_sensor_tado


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
    temperature = zigbee["living-room-multi"]["temperature"]
    humidity = zigbee["living-room-multi"]["humidity"]
    co2 = get_sensor_scd30_co2()

    # Display moisture and temp readings
    print("Temperature: {}".format(temperature))
    print("Relative Humidity: {}".format(humidity))
    print("CO2 Level: {}".format(co2))

    # Create message payload
    payload = {"state": {"reported": {
        "temperature": str(temperature), "humidity": str(humidity), "co2": str(co2)}}}

    # Update shadow
    deviceShadowHandler.shadowUpdate(json.dumps(
        payload), customShadowCallback_Update, 5)
    time.sleep(10)
