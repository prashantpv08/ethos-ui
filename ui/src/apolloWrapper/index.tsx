import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { useModuleLanguage } from '@ethos-frontend/context';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { ERROR_MESSAGES } from '@ethos-frontend/constants';
import { getAuthHeaders, getLangHeader } from '../utils/api';
import {
  getStorage,
  handleCustomerExpiredToken,
  isCustomerTokenExpired,
} from '@ethos-frontend/utils';
import i18n from "i18next"

const getGraphQLUri = () => {
  return typeof process !== 'undefined' &&
    process.env['NEXT_PUBLIC_API_GRAPH_URL']
    ? process.env['NEXT_PUBLIC_API_GRAPH_URL']
    : import.meta.env['VITE_APP_API_GRAPH_URL'];
};

const httpLink = createHttpLink({
  uri: getGraphQLUri(),
});

const createAuthLink = (
  moduleLanguage: Record<string, string>,
  isNextApp: boolean,
) =>
  setContext((operation, { headers }) => {
    const lang = getLangHeader(moduleLanguage);
    const EXCLUDE_LANG_QUERIES = ['AccountPreference'];

    const operationName = operation.operationName || '';

    const shouldSkipLang = EXCLUDE_LANG_QUERIES.includes(operationName);

    const newHeaders = {
      ...headers,
      ...(shouldSkipLang ? {} : { lang }),
    };

    if (isNextApp) {
      if (isCustomerTokenExpired()) {
        handleCustomerExpiredToken();
        return { headers: newHeaders };
      } else {
        const token = getStorage('accessToken');
        return {
          headers: {
            ...newHeaders,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      }
    }
    return {
      headers: {
        ...newHeaders,
        ...getAuthHeaders(),
      },
    };
  });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      if (message === 'Unauthorized') {
        toast.error(i18n.t(ERROR_MESSAGES.NOT_AUTHORIZED));
      } else {
        toast.error(i18n.t(message || ERROR_MESSAGES.GENERAL));
      }
    });
  }
  if (networkError) {
    toast.error(`Network error: ${networkError.message}`);
  }
});

// 🔹 Function to create Apollo Client dynamically
const createApolloClient = (
  moduleLanguage: Record<string, string>,
  isNextApp: boolean,
) => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          keyFields: ['lang'],
        },
      },
    }),
    link: errorLink
      .concat(createAuthLink(moduleLanguage, isNextApp))
      .concat(httpLink),
  });
};

// 🔹 Apollo Provider that Reacts to Language Changes
const ApolloWrapper = ({
  children,
  isNextApp,
}: {
  children: React.ReactNode;
  isNextApp?: boolean;
}) => {
  const { moduleLanguage } = useModuleLanguage();

  const client = useMemo(
    () => createApolloClient(moduleLanguage, !!isNextApp),
    [moduleLanguage, isNextApp],
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;
