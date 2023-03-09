import { Card, Grid, styled, useTheme } from '@mui/material';
import { API_URL } from 'app/constant/api';
import { ApiGet } from 'app/service/api';
import { Fragment, useEffect, useState } from 'react';
import ColorSKUModel from '../product/model/colorSKUModel';
import DoughnutChart from './shared/Doughnut';
import RowCards from './shared/RowCards';
import StatCards from './shared/StatCards';
import StatCards2 from './shared/StatCards2';
import TopSellingTable from './shared/TopSellingTable';
import UpgradeCard from './shared/UpgradeCard';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const Analytics = () => {
  const { palette } = useTheme();
  const [dashboardList, setDashboardList] = useState({})

  const getDashboardList = async () => {
    await ApiGet(`${API_URL.dashboardDetails}`)
      .then((response) => {
        setDashboardList(response?.data ?? {});
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  useEffect(() => {
    getDashboardList();
  }, [])

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <StatCards dashboardList={dashboardList} />
            {/* <StatCards2 dashboardList={dashboardList} /> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
