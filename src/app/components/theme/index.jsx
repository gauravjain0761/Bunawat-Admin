import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  // direction: dir,
  palette: {
    primary: {
      main: '#232a45',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: "#232a45"
    }
  }
});

export default theme;
