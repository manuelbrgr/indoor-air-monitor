import board
import adafruit_scd30

i2c = board.I2C()  # uses board.SCL and board.SDA
scd30 = adafruit_scd30.SCD30(i2c)
scd30.temperature_offset = 1.1


def get_sensor_scd30_co2():
    return scd30.CO2


def get_sensor_scd30_temp():
    return scd30.temperature - scd30.temperature_offset


def get_sensor_scd30_rh():
    return scd30.relative_humidity
