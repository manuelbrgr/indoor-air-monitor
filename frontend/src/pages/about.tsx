import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import PageWrapper from '@/components/PageWrapper';
import { Grid, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { StaticImage } from 'gatsby-plugin-image';

const VideoContainerWrapper = styled.iframe`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

function AboutPage() {
  return (
    <PageWrapper>
      <Box component="main" sx={{ pt: 5, px: 2, pb: 3 }}>
        <Grid container justifyContent="center" spacing={6}>
          <Grid item xs={12} md={10} xl={8}>
            <Typography variant="h3">What is Airbase?</Typography>
            <Typography variant="body1" sx={{ pt: 3 }}>
              Airbase is a prototype for monitoring, predicting and improving
              indoor air quality with the help of IoT sensor data, Machine
              Learning, Smart LEDs, and a Virtual assistant. Sensors are
              precisely detecting air quality parameters such as CO2,
              temperature or humidity. This data is collected over a long period
              to continously train a machine learning model which later predicts
              indoor air quality parameters like CO2 or temperature to improve
              e.g. the indoor environment or heating costs. Additionally,
              covariates such as information of door sensors (open or closed)
              help to train the model for making better predictions.
            </Typography>
            <Typography variant="body1" sx={{ pt: 3 }}>
              This prototype mainly focusses on the concentration of CO2
              indoors. Once the current or predicted CO2 concentration reaches a
              certain treshold, an event is triggered to make the user aware of
              the problem. If this occurs, Airbase warns the user with acoustic
              signals through a voice assistant or visual signals through Smart
              LEDs turning red. The video below demonstrates the the prototype:
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} xl={10} textAlign={'center'}>
            <VideoContainerWrapper
              src="https://www.youtube-nocookie.com/embed/aWBYgRcb5Ac?rel=0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></VideoContainerWrapper>
          </Grid>
          <Grid item xs={12} md={10} xl={8}>
            <Typography variant="h3">How is it implemented?</Typography>
            <Typography variant="body1" sx={{ pt: 3 }}>
              The heart of Airbase is a Raspberry Pi with all relevant sensors.
              Additional weather and contact sensors are connected wirelessly
              via Zigbee. Every 10 seconds the system sends a dataset via the
              MQTT protocoll to the cloud storage. In the cloud, data is
              processed for delivering live data and historical data which is
              consumed by the web app, the notification app and the machine
              learning model.
            </Typography>
            <Grid container spacing={1.5} sx={{ pt: 3 }}>
              <Grid item xs={12} sx={{ pt: 3 }}>
                <StaticImage
                  src="../assets/images/pi_sensoren.jpg"
                  alt="A kitten"
                />
              </Grid>
              <Grid item xs={4} sx={{ pt: 3 }}>
                <StaticImage
                  src="../assets/images/co2_sensor.jpg"
                  alt="A kitten"
                />
              </Grid>
              <Grid item xs={4} sx={{ pt: 3 }}>
                <StaticImage
                  src="../assets/images/fenster_kontakt_sensor.jpg"
                  alt="A kitten"
                />
              </Grid>
              <Grid item xs={4} sx={{ pt: 3 }}>
                <StaticImage
                  src="../assets/images/balkon_multi_sensor.jpg"
                  alt="A kitten"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={10} xl={8}>
            <Typography variant="h3">Why does it exist?</Typography>
            <Typography variant="body1" sx={{ pt: 3 }}>
              Airbase is the project work related to the bachelor thesis{' '}
              <i>
                "Predicting and improving indoor air quality based on IoT sensor
                data and machine learning"
              </i>{' '}
              by Manuel Berger at the Ferdinand Porsche FernFH. It was
              supervised by Prof. Dr. Tom Gross from the University of Bamberg.
              The main motivation for this topic comes from an increasing
              interest and awareness of indoor air quality parameters due to
              work shifting to working form home during the COVID-19 pandemic.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </PageWrapper>
  );
}

AboutPage.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default AboutPage;
