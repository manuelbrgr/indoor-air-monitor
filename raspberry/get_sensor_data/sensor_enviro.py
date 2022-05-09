from pms5003 import PMS5003, ReadTimeoutError
from enviroplus import gas


pm_sensor = PMS5003(
    device='/dev/ttyAMA0',
    baudrate=9600,
    pin_enable=22,
    pin_reset=27
)

readings = False


def get_sensor_pms5003():
    global pm_sensor
    try:
        readings = pm_sensor.read()
    except:
        pm_sensor = PMS5003(
            device='/dev/ttyAMA0',
            baudrate=9600,
            pin_enable=22,
            pin_reset=27
        )
        readings = pm_sensor.read()
    return readings


def get_gas_sensor():
    return gas.read_all()
