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

const ROUTINE_EDITOR_QUERY = gql`
  query RoutineEditorQuery(
    $routineId: ID!
    $exerciseFilter: ExerciseFilterInput
  ) {
    ...EditorMain_data
    ...EditorSideBar_data
  }
  ${EditorSideBar.fragments.data}
  ${EditorMain.fragments.data}
`;

const RoutineEditorPage = ({ match }) => {
  const routineId = match.params.id;
  return (
    <Query query={ROUTINE_EDITOR_QUERY} variables={{ routineId }}>
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

export { ROUTINE_EDITOR_QUERY };

export default withRouter(RoutineEditorPage);
