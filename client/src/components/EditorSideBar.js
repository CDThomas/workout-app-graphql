import React, { Component } from "react";
import withFragment from "../utils/withFragment";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import styled from "react-emotion";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import CreateExerciseModal from "./CreateExerciseModal";
import List from "./List";
import { Title } from "./typography";
import { Mutation, ApolloConsumer } from "react-apollo";
import { ROUTINE_EDITOR_QUERY } from "../pages/RoutineEditorPage";
import clientUUID from "../utils/clientUUID";

const Button = styled("button")`
  font-size: 14px;
  font-weight: 400;
  padding-bottom: 0;
  color: #005eaf;
  border: none;
  outline: none;
  text-decoration: underline;
  cursor: pointer;
`;

const Text = styled("span")`
  font-size: 14px;
  font-weight: 300;
`;

const fragment = {
  data: gql`
    fragment EditorSideBar_data on Query {
      exercises(filter: $exerciseFilter) {
        id
        name
      }
    }
  `
};

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
          <ApolloConsumer>
            {client => {
              const updateExercises = async evt => {
                // XXX: This works but kinda sucks. There's a lot of knowledge of different
                // things here. Doing this to prevent rerendering the whole page
                // when the exerciseFilter (search input) changes. Giving the
                // sidebar its own Query component could be cleaner/simpler.
                // Or the parent could at least pass down a func for updating
                // exercises.
                const searchStr = evt.target.value;
                const exerciseFilter =
                  searchStr && searchStr.length > 0
                    ? { name: searchStr.trim() }
                    : null;

                const result = await client.query({
                  query: gql`
                    query ExerciseSearch($exerciseFilter: ExerciseFilterInput) {
                      ...EditorSideBar_data
                    }
                    ${fragment.data}
                  `,
                  variables: { exerciseFilter }
                });

                const data = client.readQuery({
                  query: ROUTINE_EDITOR_QUERY,
                  variables: { routineId }
                });

                data.exercises = result.data.exercises;

                client.writeQuery({
                  query: ROUTINE_EDITOR_QUERY,
                  variables: { routineId },
                  data
                });
              };

              return (
                <SearchBar
                  onChange={updateExercises}
                  placeholder="Find an exercise..."
                />
              );
            }}
          </ApolloConsumer>
          <Text>
            or
            <Button onClick={this.handleCreateExerciseClick}>create one</Button>
          </Text>
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
                    variables: { routineId }
                  });

                  data.routine.sets = [...data.routine.sets, createRoutineSet];

                  cache.writeQuery({
                    query: ROUTINE_EDITOR_QUERY,
                    variables: { routineId },
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

export default withRouter(withFragment(EditorSideBar, fragment));
