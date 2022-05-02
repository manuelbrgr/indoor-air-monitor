import time
import busio
import adafruit_sgp30

import board
i2c = busio.I2C(board.SCL, board.SDA, frequency=100000)

sgp30 = adafruit_sgp30.Adafruit_SGP30(i2c)

sgp30.iaq_init()

def get_sensor_sgp30_tvoc():
    return sgp30.TVOC

def get_sensor_sgp30_eco2():
    return sgp30.eCO2
