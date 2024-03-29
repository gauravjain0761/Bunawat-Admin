import { Box, Card, Grid, Icon, IconButton, styled, Tooltip } from '@mui/material';
import { Small } from 'app/components/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': { color: theme.palette.text.secondary },
  '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.main,
}));

const StatCards = ({ dashboardList }) => {
  const navigate = useNavigate();
  const cardList = [
    { name: 'Total Customer', amount: dashboardList?.total_customer ?? 0, icon: 'group', link: "/customer" },
    { name: 'Total Resellers', amount: dashboardList?.total_reseller ?? 0, icon: 'group', link: "/reseller" },
    { name: 'Total Influncers', amount: dashboardList?.total_influencer ?? 0, icon: 'group', link: "/influncer" },
    { name: 'This week Sales', amount: dashboardList?.total_sales ?? 0, icon: 'currency_rupee_Icon', link: "#" },
    { name: 'Inventory', amount: dashboardList?.total_inventory ?? 0, icon: 'store', link: "/inventory/list" },
    { name: 'Orders', amount: dashboardList?.total_orders ?? 0, icon: 'shopping_cart', link: "/order/list" },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: '24px' }}>
      {cardList.map((item, index) => (
        <Grid item xs={12} md={4} key={index}>
          <StyledCard elevation={4}>
            <ContentBox>
              <Icon className="icon">{item.icon}</Icon>
              <Box ml="12px">
                <Small>{item.name}</Small>
                <Heading>{item.amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <IconButton onClick={() => navigate(item?.link)}>
                <Icon>arrow_right_alt</Icon>
              </IconButton>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
