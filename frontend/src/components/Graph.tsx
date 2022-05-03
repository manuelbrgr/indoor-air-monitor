import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import * as d3 from 'd3';

Chart.register(...registerables);

export default function Graph({ url }: { url: string }) {
  const [data, setData] = useState({
    labels: [],
    datasets: {
      temperature: [],
      humidity: [],
      temperature_outdoor: [],
      co2: [],
      heating: [],
      door: [],
      window: [],
      balcony: [],
    },
  });
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
          const co2 = [];
          const heating = [];
          const door = [];
          const window = [];
          const balcony = [];

          for (const i in datapoints) {
            if (isNaN(i)) continue;
            const current = datapoints[i];
            timestamp.push(
              `${moment.utc(current.timestamp).format(`DD.MM.YY HH:mm:ss`)}`,
            );
            temperature.push(current.rtemperature);
            humidity.push(current.rhumidity);
            temperatureOutdoor.push(current.temperature_outdoor);
            co2.push(current.co2);
            heating.push(current.heating);
            door.push(current.livingroom_door_open == `true` ? 1 : 0);
            window.push(current.livingroom_window_open == `true` ? 1 : 0);
            balcony.push(current.balcony_door_open == `true` ? 1 : 0);
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
              temperature_outdoor: temperatureOutdoor.reverse(),
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

  return (
    <div>
      <Line
        data={{
          labels: data.labels,
          datasets: [
            {
              label: `temp`,
              data: data.datasets.temperature,
              borderWidth: 1,
              borderColor: `blue`,
              backgroundColor: `blue`,
              yAxisID: `temperature`,
              pointRadius: 0,
            },
            {
              label: `rh`,
              data: data.datasets.humidity,
              borderWidth: 1,
              borderColor: `red`,
              backgroundColor: `red`,
              yAxisID: `humidity`,
              pointRadius: 0,
            },
            {
              label: `outdoor temp`,
              data: data.datasets.temperature_outdoor,
              borderWidth: 1,
              borderColor: `darkblue`,
              backgroundColor: `darkblue`,
              hidden: true,
              yAxisID: `temperature`,
              pointRadius: 0,
            },
            {
              label: `co2`,
              data: data.datasets.co2,
              borderWidth: 1,
              borderColor: `green`,
              backgroundColor: `green`,
              yAxisID: `co2`,
              pointRadius: 0,
            },
            {
              type: `bar`,
              label: `Heating`,
              backgroundColor: `rgb(255,255,224)`,
              borderColor: `rgb(255,255,224)`,
              data: data.datasets.heating,
              hidden: true,
              yAxisID: `percentage`,
            },
            {
              label: `Door`,
              data: data.datasets.door,
              backgroundColor: `rgb(60, 60, 60)`,
              borderColor: `rgb(60, 60, 60)`,
              borderWidth: 1,
              yAxisID: `boolean`,
              hidden: true,
              pointRadius: 0,
            },
            {
              label: `Window`,
              data: data.datasets.window,
              backgroundColor: `rgb(60, 60, 60)`,
              borderColor: `rgb(60, 60, 60)`,
              borderWidth: 1,
              yAxisID: `boolean`,
              hidden: true,
              pointRadius: 0,
            },
            {
              label: `Balcony`,
              data: data.datasets.balcony,
              backgroundColor: `rgb(60, 60, 60)`,
              borderWidth: 1,
              yAxisID: `boolean`,
              hidden: true,
              pointRadius: 0,
            },
          ],
        }}
        options={{
          scales: {
            xAxis: {
              ticks: { autoSkip: true, maxRotation: 15 },
            },
            temperature: {
              type: `linear`,
              position: `left`,
            },
            humidity: {
              type: `linear`,
              position: `right`,
            },
            percentage: {
              type: `linear`,
              position: `right`,
              max: 100,
            },
            boolean: {
              type: `linear`,
              position: `left`,
              display: false,
              min: 0,
              max: 2,
            },
            co2: {
              type: `linear`,
              position: `left`,
              min: 380,
            },
          },
        }}
      />
    </div>
  );
}
