import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import LiveData from '@/components/LiveData';
import HistoricalData from '@/components/HistoricalData';
import PageWrapper from '@/components/PageWrapper';

function IndexPage() {
  return (
    <PageWrapper>
      <Box component="main" sx={{ p: 3 }}>
        <Box sx={{ pb: 4 }} style={{ borderBottom: '1px solid #d3d3d3' }}>
          <LiveData />
        </Box>
        <Box sx={{ mt: 6 }}>
          <HistoricalData />
        </Box>
      </Box>
    </PageWrapper>
  );
}

IndexPage.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default IndexPage;
