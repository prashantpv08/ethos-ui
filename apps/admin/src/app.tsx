import RoutesWrapper from "./Router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApolloWrapper from "@ethos-frontend/apollo";
import { EOThemeProvider } from "@ethos-frontend/ui";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: false,
    },
  },
});

const App = () => {
  return (
    <ApolloWrapper>
      <QueryClientProvider client={queryClient}>
        <EOThemeProvider>
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
