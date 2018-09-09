import React from "react";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
import styled from "react-emotion";
import { Title } from "../components/typography";
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

const SetCard = ({ set }) => {
  const { id, setCount, repCount, exercise, routine } = set;
  const routineId = routine.id;

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

export default withFragment(SetCard, {
  set: gql`
    fragment SetCard_set on RoutineSet {
      id
      setCount
      repCount
      exercise {
        id
        name
      }
      routine {
        id
      }
    }
  `
});
