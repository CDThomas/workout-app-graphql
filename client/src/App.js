import React, { Component, Fragment } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";
import "./App.css";

const client = new ApolloClient({});

const RoutineItem = ({ routine }) => {
  const { name } = filter(RoutineItem.fragments.routine, routine);
  return (
    <li>
      <p>{`Name: ${name}`}</p>
    </li>
  );
};
RoutineItem.fragments = {
  routine: gql`
    fragment RoutineItem_routine on Routine {
      name
    }
  `
};

const RoutineList = ({ data }) => {
  const { routines } = filter(RoutineList.fragments.routines, data);
  return (
    <Fragment>
      <h1>Routines</h1>
      <ul>
        {routines.map(routine => (
          <RoutineItem key={routine.id} routine={routine} />
        ))}
      </ul>
    </Fragment>
  );
};
RoutineList.fragments = {
  routines: gql`
    fragment RoutineList_data on Query {
      routines {
        id
        ...RoutineItem_routine
      }
    }
    ${RoutineItem.fragments.routine}
  `
};

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`
            query AppQuery {
              ...RoutineList_data
            }
            ${RoutineList.fragments.routines}
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
