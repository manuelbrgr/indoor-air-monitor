import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Co2Icon from '@mui/icons-material/Co2';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterIcon from '@mui/icons-material/Water';
import CloudIcon from '@mui/icons-material/Cloud';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import DoorBackIcon from '@mui/icons-material/DoorBack';
import WindowIcon from '@mui/icons-material/Window';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { getLiveData } from '@/api/getLiveData';
import { LinearProgress, Tooltip } from '@mui/material';

function LiveDataItem({ icon, title, value, unit, infotext, max }) {
  return (
    <Paper elevation={3}>
      {infotext && (
        <Box display="flex" justifyContent="right" sx={{ mb: -4, p: 0.5 }}>
          <Tooltip title={infotext}>
            <InfoOutlinedIcon style={{ cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ pt: 2 }}
      >
        <Typography variant="overline" sx={{ mt: 1, mr: 1 }}>
          {icon}
        </Typography>
        <Typography variant="overline">{title}</Typography>
      </Box>
      <Box
        textAlign="center"
        style={{ color: max && value >= max ? ' #ba000d' : 'inherit' }}
        sx={{ pb: 2 }}
      >
        {value ? (
          <>
            <Typography variant="h4" component="span">
              {value}
            </Typography>
            <Typography variant="h6" component="span">
              {unit}
            </Typography>
          </>
        ) : (
          <Typography variant="h4" component="span">
            /
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

export default function LiveData() {
  const [countdown, setCountdown] = useState(0);
  const [liveData, setLiveData] = useState({
    temperature: false,
    humidity: false,
    pressure: false,
    co2: false,
    co2predicted: false,
    balconyDoor: false,
    livingroomWindow: false,
    livingroomDoor: false,
    kitchenWindow: false,
    temperatureOutdoor: false,
    humidityOutdoor: false,
    heating: false,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getLiveData();

      setLiveData({
        temperature: data.state?.rtemperature,
        humidity: data.state?.rhumidity,
        pressure: data.state?.pressure,
        co2: data.state?.co2,
        co2predicted: data.state?.prediction_co2.value,
        balconyDoor: data.state?.balcony_door_open,
        livingroomWindow: data.state?.livingroom_window_open,
        livingroomDoor: data.state?.livingroom_door_open,
        kitchenWindow: data.state?.kitchen_window_open,
        temperatureOutdoor: data.state?.temperature_outdoor,
        humidityOutdoor: data.state?.humidity_outdoor,
        heating: data.state?.heating,
      });
      setLoading(false);
    };

    let i = 0;
    const fetchDataInterval = () => {
      window.setTimeout(() => {
        setCountdown(i);
        if (i <= 0) {
          fetchData();
          i = 30;
        }
        fetchDataInterval();
        i--;
      }, 1000);
    };

    fetchDataInterval();
  }, []);

  const sensorDataPrimary = [
    {
      icon: <ThermostatIcon />,
      title: 'Indoor Temp.',
      value: liveData.temperature,
      unit: '°C',
      infotext: 'The temperature should not exceed 24° Celsius.',
      max: 24,
    },
    {
      icon: <WaterIcon />,
      title: 'Indoor Humid.',
      value: liveData.humidity,
      unit: '% RH',
      infotext: 'The relative humidity should not exceed 60%.',
      max: 60,
    },
    {
      icon: <Co2Icon />,
      title: 'CO2',
      value: liveData.co2,
      unit: 'ppm',
      infotext: 'The CO2 concentration should not exceed 1.000 ppm.',
      max: 1000,
    },
    {
      icon: <Co2Icon />,
      title: 'CO2 Prediction (15min)',
      value: liveData.co2predicted,
      unit: 'ppm',
      infotext:
        'The prediction of the CO2 concentration should not exceed 1.000 ppm.',
      max: 1000,
    },
    {
      icon: <DoorBackIcon />,
      title: 'Balcony Door',
      value: liveData.balconyDoor ? 'open' : 'closed',
      unit: '',
      infotext: false,
      max: false,
    },

    {
      icon: <WindowIcon />,
      title: 'Livingroom Window',
      value: liveData.livingroomWindow ? 'open' : 'closed',
      unit: '',
      infotext: false,
      max: false,
    },
    {
      icon: <DoorFrontIcon />,
      title: 'Livingroom Door',
      value: liveData.livingroomDoor ? 'open' : 'closed',
      unit: '',
      infotext: false,
      max: false,
    },
    {
      icon: <WindowIcon />,
      title: 'Kitchen Window',
      value: liveData.kitchenWindow ? 'open' : 'closed',
      unit: '',
      infotext: false,
      max: false,
    },
  ];

  const sensorDataSecondary = [
    {
      icon: <ThermostatIcon />,
      title: 'Outdoor Temp.',
      value: liveData.temperatureOutdoor,
      unit: '°C',
      infotext: false,
      max: false,
    },
    {
      icon: <WaterIcon />,
      title: 'Outdoor Humid.',
      value: liveData.humidityOutdoor,
      unit: '% RH',
      infotext: false,
      max: false,
    },
    {
      icon: <CloudIcon />,
      title: 'Pressure',
      value: liveData.pressure,
      unit: 'hPa',
      infotext: false,
      max: false,
    },
    {
      icon: <FireplaceIcon />,
      title: 'Heating',
      value: liveData.heating || 'OFF',
      unit: '',
      infotext: false,
      max: false,
    },
  ];

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mb: 3 }}
        >
          <Grid item xs={12} pb={loading ? 0 : 1.5}>
            <Typography variant="h4" sx={{ my: 0 }}>
              LIVE Data
            </Typography>
            <Typography variant="caption" sx={{ my: 0 }}>
              These values represent the indoor room choosen for this
              experiment. Next reading in: {countdown}sec
            </Typography>
          </Grid>
          {loading && (
            <Grid item xs={12} textAlign="right">
              <LinearProgress />
            </Grid>
          )}
          {sensorDataPrimary.map((item, i) => (
            <Grid item key={i} xs={12} md={6} lg={3}>
              <LiveDataItem
                icon={item.icon}
                title={item.title}
                value={item.value}
                unit={item.unit}
                infotext={item.infotext}
                max={item.max}
              />
            </Grid>
          ))}
        </Grid>
      </ThemeProvider>

      <ThemeProvider theme={lightTheme}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ my: 3 }}
        >
          {sensorDataSecondary.map((item, i) => (
            <Grid item key={i} xs={12} md={6} lg={3}>
              <LiveDataItem
                icon={item.icon}
                title={item.title}
                value={item.value}
                unit={item.unit}
                infotext={item.infotext || false}
                max={item.max || false}
              />
            </Grid>
          ))}
        </Grid>
      </ThemeProvider>
    </>
  );
}
