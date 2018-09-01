import React, { Component } from "react";
import withFragment from "../utils/withFragment";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import styled from "react-emotion";
import SideBar from "./SideBar";
import CreateExerciseModal from "./CreateExerciseModal";
import List from "./List";
import { Title } from "./typography";
import { Mutation } from "react-apollo";
import { ROUTINE_EDITOR_QUERY } from "../pages/RoutineEditorPage";
import clientUUID from "../utils/clientUUID";

const Button = styled("button")`
  font-size: 14px;
  font-weight: 400;
  color: #005eaf;
  border: none;
  outline: none;
  text-decoration: underline;
  cursor: pointer;
`;

class EditorSideBar extends Component {
  state = {
    isModalOpen: false
  };

  handleCreateExerciseClick = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen
    }));
  };

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  render() {
    const { isModalOpen } = this.state;
    const { data, match } = this.props;
    const { exercises } = data;
    const routineId = match.params.id;

    return (
      <SideBar>
        <SideBar.Header>
          <Title weight="medium">Exercises</Title>
          <Button onClick={this.handleCreateExerciseClick}>create one</Button>
          <CreateExerciseModal
            isOpen={isModalOpen}
            onRequestClose={this.handleCloseModal}
            onExerciseCreated={this.handleExerciseCreated}
          />
        </SideBar.Header>
        <SideBar.Content>
          <List>
            {exercises.map(exercise => (
              <Mutation
                key={exercise.id}
                mutation={gql`
                  mutation CreateRoutineSet($input: CreateRoutineSetInput!) {
                    createRoutineSet(input: $input) {
                      id
                      exercise {
                        id
                        name
                      }
                    }
                  }
                `}
                optimisticResponse={{
                  __typename: "Mutation",
                  createRoutineSet: {
                    __typename: "RoutineSet",
                    id: clientUUID(),
                    exercise: {
                      __typename: "Exercise",
                      id: exercise.id,
                      name: exercise.name
                    }
                  }
                }}
                update={(cache, { data: { createRoutineSet } }) => {
                  // TODO: is there a better way to share queries?

                  const data = cache.readQuery({
                    query: ROUTINE_EDITOR_QUERY,
                    variables: { id: routineId }
                  });

                  data.routine.sets = [...data.routine.sets, createRoutineSet];

                  cache.writeQuery({
                    query: ROUTINE_EDITOR_QUERY,
                    variables: { id: routineId },
                    data
                  });
                }}
              >
                {createRoutineSet => (
                  <List.Item
                    onClick={() =>
                      createRoutineSet({
                        variables: {
                          input: { routineId, exerciseId: exercise.id }
                        }
                      })
                    }
                  >
                    <Title>{exercise.name}</Title>
                  </List.Item>
                )}
              </Mutation>
            ))}
          </List>
        </SideBar.Content>
      </SideBar>
    );
  }
}

export default withRouter(
  withFragment(EditorSideBar, {
    data: gql`
      fragment EditorSideBar_data on Query {
        exercises {
          id
          name
        }
      }
    `
  })
);
