import React, { Fragment } from "react";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
import styled from "react-emotion";
import { Title } from "../components/typography";
import RoutineEditorHeader from "./RoutineEditorHeader";
import Button from "./Button";
import { Mutation } from "react-apollo";
import { ROUTINE_EDITOR_QUERY } from "../pages/RoutineEditorPage";

const Card = styled("div")`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const BottomRow = styled("div")`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CapsText = styled("span")`
  font-weight: 400;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #999;
`;

const SetCard = ({ set, routineId }) => {
  const { id, setCount, repCount, exercise } = set;

  return (
    <Card>
      <Title>{exercise.name}</Title>
      <BottomRow>
        <CapsText>
          {setCount} sets, {repCount} reps
        </CapsText>
        <Mutation
          mutation={gql`
            mutation DeleteRoutineSet($id: ID!) {
              deleteRoutineSet(id: $id) {
                id
              }
            }
          `}
          optimisticResponse={{
            __typename: "Mutation",
            deleteRoutineSet: {
              __typename: "RoutineSet",
              id
            }
          }}
          update={(cache, { data: { deleteRoutineSet: deletedSet } }) => {
            // TODO: is there a better way to share queries?

            const data = cache.readQuery({
              query: ROUTINE_EDITOR_QUERY,
              variables: { routineId }
            });

            data.routine.sets = data.routine.sets.filter(
              set => set.id !== deletedSet.id
            );

            cache.writeQuery({
              query: ROUTINE_EDITOR_QUERY,
              variables: { routineId },
              data
            });
          }}
        >
          {deleteRoutineSet => (
            <Button
              size="small"
              color="white"
              onClick={() => {
                deleteRoutineSet({ variables: { id } });
              }}
            >
              Delete
            </Button>
          )}
        </Mutation>
      </BottomRow>
    </Card>
  );
};

const SetList = ({ sets, routineId }) => {
  return (
    <ol>
      {sets.map(set => (
        <li key={set.id}>
          <SetCard set={set} routineId={routineId} />
        </li>
      ))}
    </ol>
  );
};

const EditorMain = ({ data }) => {
  const { routine } = data;

  return (
    <Fragment>
      <RoutineEditorHeader routine={routine} />
      <SetList sets={routine.sets} routineId={routine.id} />
    </Fragment>
  );
};

export default withFragment(EditorMain, {
  data: gql`
    fragment EditorMain_data on Query {
      routine(id: $routineId) {
        id
        name
        sets {
          id
          setCount
          repCount
          exercise {
            id
            name
          }
        }
      }
    }
  `
});
