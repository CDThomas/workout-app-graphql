import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const RoutineListPage = ({ match }) => {
  const id = match.params.id;
  return (
    <Query
      query={gql`
        query RoutineEditorQuery($id: ID!) {
          routine(id: $id) {
            name
          }
        }
      `}
      variables={{ id }}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return <h1>{data.routine.name}</h1>;
      }}
    </Query>
  );
};

export default withRouter(RoutineListPage);
