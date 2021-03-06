import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export function createApollo(httpLink: HttpLink, uri: string) {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all'
      }
    }
  };
}
