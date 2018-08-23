import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import styled from "react-emotion";
import Container from "../components/Container";
import SideBar from "../components/SideBar";
import List from "../components/List";
import { Header, Title } from "../components/typography";

const Content = styled("div")`
  /* Offset sidebar width */
  margin-left: 420px;
  padding: 25px;
`;

const RoutineEditorPage = ({ match }) => {
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

        return (
          <Container>
            <SideBar>
              <SideBar.Header>
                <Header>Exercises</Header>
              </SideBar.Header>
              <SideBar.Content>
                <List>
                  {Array.from({ length: 50 }).map((_, i) => (
                    <List.Item key={i}>
                      <Title>Excercise #{i + 1}</Title>
                    </List.Item>
                  ))}
                </List>
              </SideBar.Content>
            </SideBar>
            <Content>
              <Header>{data.routine.name}</Header>
            </Content>
          </Container>
        );
      }}
    </Query>
  );
};

export default withRouter(RoutineEditorPage);
