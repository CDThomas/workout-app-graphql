import React, { Component } from "react";
import withFragment from "../utils/withFragment";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import SubtleButton from "./SubtleButton";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import CreateExerciseModal from "./CreateExerciseModal";
import List from "./List";
import { Title, Text } from "./typography";
import { Mutation, ApolloConsumer } from "react-apollo";
import { ROUTINE_EDITOR_QUERY } from "../pages/RoutineEditorPage";
import clientUUID from "../utils/clientUUID";
import capitalize from "lodash/capitalize";
import styled from "react-emotion";

const DEFAULT_SET_COUNT = 3;
const DEFAULT_REP_COUNT = 8;

const MainMuscleWorked = styled("div")`
  padding-top: 10px;
`;

const fragment = {
  data: gql`
    fragment EditorSideBar_data on Query {
      exercises(filter: $exerciseFilter) {
        id
        name
        mainMuscleWorked {
          name
        }
      }
      ...CreateExerciseModal_data
    }
    ${CreateExerciseModal.fragments.data}
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
            <SubtleButton onClick={this.handleCreateExerciseClick}>
              create one
            </SubtleButton>
          </Text>
          <CreateExerciseModal
            isOpen={isModalOpen}
            onRequestClose={this.handleCloseModal}
            onExerciseCreated={this.handleExerciseCreated}
            data={data}
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
                      setCount
                      repCount
                      hasPendingChanges @client
                      exercise {
                        id
                        name
                      }
                      routine {
                        id
                      }
                    }
                  }
                `}
                optimisticResponse={{
                  __typename: "Mutation",
                  createRoutineSet: {
                    __typename: "RoutineSet",
                    id: clientUUID(),
                    setCount: DEFAULT_SET_COUNT,
                    repCount: DEFAULT_REP_COUNT,
                    hasPendingChanges: false,
                    exercise: {
                      __typename: "Exercise",
                      id: exercise.id,
                      name: exercise.name
                    },
                    routine: {
                      __typename: "Routine",
                      id: routineId
                    }
                  }
                }}
                update={(cache, { data: { createRoutineSet } }) => {
                  // TODO: Find a better way to share fragments with mutations.
                  //       This includes the query for the output of the mutation
                  //       an also the query to update the cache.
                  const data = cache.readQuery({
                    query: ROUTINE_EDITOR_QUERY,
                    variables: { routineId }
                  });

                  const newSet = {
                    ...createRoutineSet,
                    hasPendingChanges: false
                  };

                  data.routine.sets = [...data.routine.sets, newSet];

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
                          input: {
                            routineId,
                            exerciseId: exercise.id,
                            setCount: DEFAULT_SET_COUNT,
                            repCount: DEFAULT_REP_COUNT
                          }
                        }
                      })
                    }
                  >
                    <Title>{exercise.name}</Title>
                    <MainMuscleWorked>
                      <Text>{capitalize(exercise.mainMuscleWorked.name)}</Text>
                    </MainMuscleWorked>
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
