import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import styled from "react-emotion";
import Container from "../components/Container";
import EditorSideBar from "../components/EditorSideBar";
import EditorMain from "../components/EditorMain";

const Content = styled("div")`
  /* Offset sidebar width */
  margin-left: 420px;
  padding: 25px;
  flex: 1;
`;

const RoutineEditorPage = ({ match }) => {
  const id = match.params.id;
  return (
    <Query
      query={gql`
        query RoutineEditorQuery($id: ID!) {
          ...EditorMain_data
          ...EditorSideBar_data
        }
        ${EditorSideBar.fragments.data}
        ${EditorMain.fragments.data}
      `}
      variables={{ id }}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return (
          <Container>
            <EditorSideBar data={data} />
            <Content>
              <EditorMain data={data} />
            </Content>
          </Container>
        );
      }}
    </Query>
  );
};

export default withRouter(RoutineEditorPage);