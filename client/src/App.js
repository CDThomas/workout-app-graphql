import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";
import RoutineList from "./RoutineList";
import "./App.css";

const client = new ApolloClient({});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`
            query AppQuery {
              ...RoutineList_data
            }
            ${RoutineList.fragments.data}
          `}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return <RoutineList data={data} />;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
