import React, { useState, useEffect, useReducer, useRef } from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import * as d3 from 'd3';
import { Grid, Box, Tabs, Tab, Typography } from '@mui/material';

const baseUrl = `https://iaq-data.brgr.rocks`;

Chart.register(...registerables);
Chart.register(annotationPlugin);

export function Graph({ url, type }: { url: string; type: string }) {
  const [rendered, rerender] = useState(true);

  useEffect(() => {
    // workaround for issue with annotation plugin
    if (type === 'co2') {
      rerender(false);
      setTimeout(() => {
        rerender(true);
      }, 0);
    }
  }, [type]);

  const [data, setData] = useState({
    labels: [],
    datasets: {
      temperature: [],
      humidity: [],
      temperatureOutdoor: [],
      humidityOutdoor: [],
      co2: [],
      heating: [],
      door: [],
      window: [],
      balcony: [],
      draftwindow: [],
    },
  });

  const graphValues = {
    values: {
      temperature: [
        {
          label: `Temp`,
          data: data.datasets.temperature,
          borderWidth: 2,
          borderColor: `blue`,
          backgroundColor: `blue`,
          yAxisID: `temperature`,
          pointRadius: 0,
        },
        {
          label: `Outdoor Temp`,
          data: data.datasets.temperatureOutdoor,
          borderWidth: 2,
          borderColor: `darkblue`,
          backgroundColor: `darkblue`,
          hidden: true,
          yAxisID: `temperature`,
          pointRadius: 0,
        },
      ],
      humidity: [
        {
          label: `Humid`,
          data: data.datasets.humidity,
          borderWidth: 2,
          borderColor: `red`,
          backgroundColor: `red`,
          yAxisID: `humidity`,
          pointRadius: 0,
        },
        {
          label: `Outdoor Humid`,
          data: data.datasets.humidityOutdoor,
          borderWidth: 2,
          borderColor: `red`,
          backgroundColor: `red`,
          hidden: true,
          yAxisID: `humidity`,
          pointRadius: 0,
        },
      ],
      co2: [
        {
          label: `CO2`,
          data: data.datasets.co2,
          borderWidth: 2,
          borderColor: `green`,
          backgroundColor: `green`,
          yAxisID: `co2`,
          pointRadius: 0,
        },
      ],
      doorsWindowsPrimary: [
        {
          label: `Balcony`,
          data: data.datasets.balcony,
          backgroundColor: `rgb(60, 60, 60)`,
          borderColor: `rgb(60, 60, 60)`,
          borderWidth: 2,
          yAxisID: `boolean`,
          pointRadius: 0,
        },

        {
          label: `Window`,
          data: data.datasets.window,
          backgroundColor: `rgb(60, 60, 60)`,
          borderColor: `rgb(60, 60, 60)`,
          borderWidth: 2,
          yAxisID: `boolean`,
          hidden: true,
          pointRadius: 0,
        },
      ],
      doorsWindowsSecundary: [
        {
          label: `Door`,
          data: data.datasets.door,
          backgroundColor: `rgb(60, 60, 60)`,
          borderColor: `rgb(60, 60, 60)`,
          borderWidth: 2,
          yAxisID: `boolean`,
          hidden: true,
          pointRadius: 0,
        },

        {
          label: `Draft Window`,
          data: data.datasets.draftwindow,
          backgroundColor: `rgb(60, 60, 60)`,
          borderColor: `rgb(60, 60, 60)`,
          borderWidth: 2,
          yAxisID: `boolean`,
          hidden: true,
          pointRadius: 0,
        },
      ],
      heating: [
        {
          type: `bar`,
          label: `Heating`,
          backgroundColor: `rgb(255,255,224)`,
          borderColor: `rgb(255,255,224)`,
          data: data.datasets.heating,
          yAxisID: `percentage`,
        },
      ],
    },
    scalers: {
      temperature: {
        type: `linear`,
        position: `left`,
      },
      humidity: {
        type: `linear`,
        position: `right`,
      },
      co2: {
        type: `linear`,
        position: `left`,
        min: 380,
        offset: true,
      },
      percentage: {
        type: `linear`,
        position: `right`,
        max: 100,
      },
      boolean: {
        type: `linear`,
        position: `right`,
        display: false,
        min: 0,
        max: 2,
      },
    },
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        d3.csv(url).then((datapoints) => {
          const timestamp = [];
          const temperature = [];
          const humidity = [];
          const temperatureOutdoor = [];
          const humidityOutdoor = [];
          const co2 = [];
          const heating = [];
          const door = [];
          const window = [];
          const balcony = [];
          const draftwindow = [];

          for (const i in datapoints) {
            if (isNaN(i)) continue;
            const current = datapoints[i];
            timestamp.push(
              `${moment.utc(current.timestamp).format(`DD.MM.YY HH:mm:ss`)}`,
            );
            temperature.push(current.rtemperature);
            humidity.push(current.rhumidity);
            temperatureOutdoor.push(current.temperature_outdoor);
            humidityOutdoor.push(current.humidity_outdoor);
            co2.push(current.co2);
            heating.push(current.heating);
            door.push(current.livingroom_door_open == `true` ? 1 : 0);
            window.push(current.livingroom_window_open == `true` ? 1 : 0);
            balcony.push(current.balcony_door_open == `true` ? 1 : 0);
            draftwindow.push(current.kitchen_window_open == `true` ? 1 : 0);
          }

          setData({
            labels: timestamp.reverse(),
            datasets: {
              temperature: temperature.reverse(),
              humidity: humidity.reverse(),
              co2: co2.reverse(),
              heating: heating.reverse(),
              door: door.reverse(),
              window: window.reverse(),
              balcony: balcony.reverse(),
              draftwindow: draftwindow.reverse(),
              temperatureOutdoor: temperatureOutdoor.reverse(),
              humidityOutdoor: humidityOutdoor.reverse(),
            },
          });
        });
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  let dataset, scalers, annotations;
  switch (type) {
    case 'temperature':
      dataset = graphValues.values.temperature
        .concat(graphValues.values.humidity)
        .concat(graphValues.values.doorsWindowsPrimary);
      scalers = {
        temperature: graphValues.scalers.temperature,
        humidity: graphValues.scalers.humidity,
        boolean: graphValues.scalers.boolean,
      };
      break;
    case 'heating':
      dataset = graphValues.values.temperature
        .concat(graphValues.values.doorsWindowsPrimary)
        .concat(graphValues.values.heating);
      scalers = {
        temperature: graphValues.scalers.temperature,
        percentage: graphValues.scalers.percentage,
        boolean: graphValues.scalers.boolean,
      };
      break;
    default:
      dataset = graphValues.values.co2
        .concat(graphValues.values.doorsWindowsPrimary)
        .concat(graphValues.values.doorsWindowsSecundary);
      scalers = {
        co2: graphValues.scalers.co2,
        boolean: graphValues.scalers.boolean,
      };
      annotations = {
        co2max: {
          type: 'line',
          yMin: 1000,
          yMax: 1000,
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
        },
        co2maxInfo: {
          type: 'label',
          yValue: 1000,
          backgroundColor: 'rgba(245,245,245, 0.5)',
          content: ['CO2 concentration levels', 'should not exceed 1,000 ppm'],
          font: {
            size: 11,
          },
        },
      };
      break;
  }

  return (
    <div>
      {rendered ? (
        <Line
          data={{
            labels: data.labels,
            datasets: dataset,
          }}
          options={{
            scales: {
              xAxis: {
                ticks: { autoSkip: true, maxRotation: 15 },
              },
              ...scalers,
            },
            plugins: {
              annotation: {
                annotations: {
                  ...annotations,
                },
              },
            },
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default function HistoricalData() {
  const [period, setPeriod] = React.useState(`15min`);
  const [type, setType] = React.useState(`co2`);

  const handleTypeChange = (event: React.SyntheticEvent, newType: string) => {
    setType(newType);
  };

  const handlePeriodChange = (
    event: React.SyntheticEvent,
    newPeriod: string,
  ) => {
    setPeriod(newPeriod);
  };

  return (
    <>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ my: 0 }}>
            Historical Data
          </Typography>
          <Typography variant="caption" sx={{ my: 0 }}>
            See how values such as CO2 and an open balcony door correlate over
            the past.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ width: `100%` }}>
            <Box sx={{ borderBottom: 1, borderColor: `divider` }}>
              <Tabs
                value={type}
                onChange={handleTypeChange}
                aria-label="basic tabs example"
              >
                <Tab label="CO2" value="co2" />
                <Tab label="Temperature and Humidity" value="temperature" />
                <Tab label="Heating" value="heating" />
              </Tabs>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ width: `100%` }}>
            <Box sx={{ borderBottom: 1, borderColor: `divider` }}>
              <Tabs
                value={period}
                onChange={handlePeriodChange}
                aria-label="basic tabs example"
              >
                <Tab label="Last 15min" value="15min" />
                <Tab label="Last Hour" value="hour" />
                <Tab label="Last Day" value="day" />
              </Tabs>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          {period === `15min` && (
            <Graph url={`${baseUrl}/15min.csv`} type={type} />
          )}
          {period === `hour` && (
            <Graph url={`${baseUrl}/hour.csv`} type={type} />
          )}
          {period === `day` && <Graph url={`${baseUrl}/day.csv`} type={type} />}
        </Grid>
      </Grid>
    </>
  );
}
