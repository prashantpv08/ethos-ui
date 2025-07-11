import { EOThemeProvider } from '@ethos-frontend/ui';
import { Bounce, ToastContainer } from 'react-toastify';
import { Routing } from '../components/routes';
import { SocketProvider } from '../components/socket';
import { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
      <Suspense fallback={<>...loading</>}>
        <EOThemeProvider>
          <SocketProvider>
            <Routing />
          </SocketProvider>
        </EOThemeProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
