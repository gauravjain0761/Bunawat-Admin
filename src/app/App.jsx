import '../fake-db';
import { Provider } from 'react-redux';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Store } from './redux/Store';
import routes from './routes';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import { ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Storage from './service/storage';

const App = () => {
  const content = useRoutes(routes);
  const navigate = useNavigate();
  const location = useLocation();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const tokenStorage = Storage.getToken();
    const decodedJwt = parseJwt(tokenStorage ?? '');
    if (!tokenStorage || (decodedJwt.exp * 1000 < Date.now())) {
      Storage.deauthenticateUser();
      navigate('/session/login', { replace: true });
    }
  }, [location?.pathname])

  return (
    <Provider store={Store}>
      <SettingsProvider>
        <MatxTheme>
          <AuthProvider>{content}</AuthProvider>
          <ToastContainer position="top-right"
            theme="colored"
            autoClose={2000}
            hideProgressBar={false} />
        </MatxTheme>
      </SettingsProvider>
    </Provider>
  );
};

export default App;
