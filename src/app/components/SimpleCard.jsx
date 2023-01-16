import { Card, Icon, IconButton } from '@mui/material';
import { Box, styled } from '@mui/system';
import { UIColor } from 'app/utils/constant';
import { useNavigate } from 'react-router-dom';

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '20px 24px',
}));

const CardTitle = styled('div')(({ subtitle }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
  marginBottom: !subtitle && '16px',
}));

const SimpleCard = ({ children, title, subtitle, backArrow, paddingZero = false, borderRadiusZero = false }) => {
  const navigate = useNavigate();
  return (<>
    <Box sx={{ backgroundColor: UIColor, color: "#fff", p: 2, mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ m: 0 }}>
        <CardTitle subtitle={subtitle} sx={{ m: 0 }}>{title}</CardTitle>
        {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      </Box>
      {backArrow &&
        <IconButton sx={{ color: "#fff", p: 0 }} onClick={() => navigate(-1)}>
          <Icon>arrow_back</Icon>
        </IconButton>}
    </Box>
    <CardRoot elevation={6} sx={{ border: `2px solid ${UIColor}`, borderRadius: borderRadiusZero ? '0px' : "0 0 8px 8px", height: 'auto', padding: paddingZero ? '0px' : '20px 24px' }}>
      {children}
    </CardRoot>
  </>
  );
};

export default SimpleCard;
