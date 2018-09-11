import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "react-emotion";
import RoutineList from "../components/RoutineList";
import Container from "../components/Container";

const Content = styled("div")`
  padding: 25px;
`;

const ROUTINE_LIST_PAGE_QUERY = gql`
  query RoutineListPageQuery {
    ...RoutineList_data
  }
  ${RoutineList.fragments.data}
`;

const RoutineListPage = () => {
  return (
    <Query query={ROUTINE_LIST_PAGE_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return (
          <Container centered>
            <Content>
              <RoutineList data={data} />
            </Content>
          </Container>
        );
      }}
    </Query>
  );
};

export { ROUTINE_LIST_PAGE_QUERY };
export default RoutineListPage;
