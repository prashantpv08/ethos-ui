import { BrowserRouter } from 'react-router-dom';
import { Routing } from './routes';
import { EOThemeProvider } from '@ethos-frontend/ui';
import AWS, { CognitoIdentityCredentials } from 'aws-sdk';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { UserProvider } from './context/user';
import { SocketProvider } from './context/socket';
import { Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import '@ethos-frontend/i18n';
import { LanguageProvider } from '@ethos-frontend/context';
import ApolloWrapper from '@ethos-frontend/apollo';

AWS.config.update({
  region: 'us-east-1',
  credentials: new CognitoIdentityCredentials({
    IdentityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID as string,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: false
    },
  },
});

export function App() {
  return (
    <LanguageProvider>
      <ApolloWrapper>
        <QueryClientProvider client={queryClient}>
          <EOThemeProvider>
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
            <UserProvider>
              <SocketProvider>
                <Suspense fallback={<CircularProgress />}>
                  <BrowserRouter>
                    <Routing />
                  </BrowserRouter>
                </Suspense>
              </SocketProvider>
            </UserProvider>
          </EOThemeProvider>
        </QueryClientProvider>
      </ApolloWrapper>
    </LanguageProvider>
  );
}

export default App;
