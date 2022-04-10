from pms5003 import PMS5003, ReadTimeoutError
from enviroplus import gas

pm_sensor = PMS5003()
readings = False


def get_sensor_pms5003():
    global pm_sensor
    try:
        readings = pm_sensor.read()
    except ReadTimeoutError:
        pm_sensor = PMS5003()
        readings = pm_sensor.read()
    return readings


def get_sensor_nh3():
    return gas.read_nh3()


def get_sensor_ox():
    return gas.read_oxidising()


def get_sensor_red():
    return gas.read_reducing()
