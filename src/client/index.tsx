import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import { App } from "./components";
import history from "./history";

const gqlClient = new ApolloClient({
  cache: new InMemoryCache({ dataIdFromObject: object => object.id || null }),
  link: createHttpLink({
    credentials: "include",
    includeExtensions: true,
    uri: "/graphql",
    useGETForQueries: true
  })
});

ReactDOM.render(
  <CookiesProvider>
    <ApolloProvider client={gqlClient}>
      <Router history={history}>
        <App />
      </Router>
    </ApolloProvider>
  </CookiesProvider>,
  document.getElementById("app")
);
