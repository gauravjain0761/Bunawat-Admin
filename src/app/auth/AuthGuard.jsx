import { STORAGE_KEY } from 'app/constant/storage';
import Storage from 'app/service/storage';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <>
      {!!Storage.get(STORAGE_KEY.token) ? (
        children
      ) : (
        <Navigate replace to="/session/login" state={{ from: pathname }} />
      )}
    </>
  );
};

export default AuthGuard;
