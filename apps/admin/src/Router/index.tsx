import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { pageRoutes } from './routes';
import { routeTypes } from '../types';
import PrivateRoute from './customRoute';
import Header from '../Containers/Header';
import Footer from '../Containers/Footer';
import { RootState, useAppSelector } from '../redux/store';
import Loading from '../Components/Loading';

function RoutesWrapper() {
  const { status } = useAppSelector((state: RootState) => state.auth);
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {pageRoutes.map((route: routeTypes) => {
          if (route.isPrivate) {
            return (
              <Route
                key={route.id}
                path={route.path}
                element={
                  <PrivateRoute isLoggedIn={status}>
                    <div className="main">
                      <Header />
                      <div className="mainContainer">
                        <route.Component {...route.pageProp} />
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
            );
          }
          return (
            <Route
              key={route.id}
              path={route.path}
              element={<route.Component {...route.pageProp} />}
            />
          );
        })}
        <Route path="*" element={<div>Error Screen here</div>} />
      </Routes>
    </Suspense>
  );
}

export default RoutesWrapper;
