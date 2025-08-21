import RoutesWrapper from '../Router';
import { createTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ApolloWrapper from '@ethos-frontend/apollo';
import { EOThemeProvider } from '@ethos-frontend/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: false,
    },
  },
});

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        light: '#223a48',
        main: '#5089AC',
        dark: '#39617A',
        contrastText: '#fff',
      },
      secondary: {
        light: '#c2185b',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
      info: {
        light: '#FEE4E2',
        main: '#F04438',
        dark: '#e6f4ff',
        contrastText: '#F04438',
      },
      grey: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D2D6DB',
        400: '#9DA4AE',
        500: '#6C737F',
        600: '#4D5761',
        700: '#384250',
        800: '#1F2A37',
        900: '#111927',
        A100: 'red',
        A200: 'blue',
        A400: 'green',
        A700: 'yellow',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: 14,
    },
  });
  return (
    <ApolloWrapper>
      <QueryClientProvider client={queryClient}>
        <EOThemeProvider customTheme={theme}>
          <BrowserRouter>
            <RoutesWrapper />
          </BrowserRouter>
          <ToastContainer hideProgressBar />
        </EOThemeProvider>
      </QueryClientProvider>
    </ApolloWrapper>
  );
};

export default App;
