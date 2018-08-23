import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import RoutineList from "../components/RoutineList";
import Container from "../components/Container";

const RoutineListPage = () => {
  return (
    <Query
      query={gql`
        query RoutineListPageQuery {
          ...RoutineList_data
        }
        ${RoutineList.fragments.data}
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return (
          <Container>
            <RoutineList data={data} />;
          </Container>
        );
      }}
    </Query>
  );
};

export default RoutineListPage;
