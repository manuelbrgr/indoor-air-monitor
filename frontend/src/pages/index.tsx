import React from 'react';

import Title from '@/components/Title';
import Graph from '@/components/Graph';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { Helmet } from 'react-helmet';

const baseUrl = `https://iaq-data.brgr.rocks`;

export default function Home() {
  const [value, setValue] = React.useState(`15min`);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>IAQ Monitor</title>
      </Helmet>
      <main>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={8}>
            <Title>Indoor Air Quality Data</Title>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ width: `100%` }}>
              <Box sx={{ borderBottom: 1, borderColor: `divider` }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
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
          <Grid item xs={8}>
            {value === `15min` && <Graph url={`${baseUrl}/15min.csv`} />}
            {value === `hour` && <Graph url={`${baseUrl}/hour.csv`} />}
            {value === `day` && <Graph url={`${baseUrl}/day.csv`} />}
          </Grid>
        </Grid>
      </main>
    </>
  );
}
