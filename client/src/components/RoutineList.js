import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import withFragment from "../utils/withFragment";
import { withRouter } from "react-router-dom";
import RoutineItem from "./RoutineItem";
import Panel from "./Panel";
import List from "./List";
import { Title } from "./typography";
import SubtleButton from "./SubtleButton";
import { ROUTINE_LIST_PAGE_QUERY } from "../pages/RoutineListPage";

const RoutineList = ({ data, history }) => {
  const { routines } = data;
  return (
    <Panel>
      <Panel.Header>
        <Title weight="medium">Routines</Title>
        <Mutation
          mutation={gql`
            mutation CreateRoutine {
              createRoutine {
                id
                ...RoutineItem_routine
              }
            }
            ${RoutineItem.fragments.routine}
          `}
          update={(cache, { data: { createRoutine } }) => {
            const data = cache.readQuery({
              query: ROUTINE_LIST_PAGE_QUERY
            });

            data.routines = [createRoutine, ...data.routines];

            cache.writeQuery({
              query: ROUTINE_LIST_PAGE_QUERY,
              data
            });
          }}
          onCompleted={({ createRoutine }) => {
            const { id } = createRoutine;
            history.push(`/routines/${id}`);
          }}
        >
          {createRoutine => {
            return (
              <SubtleButton onClick={() => createRoutine()}>
                create one
              </SubtleButton>
            );
          }}
        </Mutation>
      </Panel.Header>
      <Panel.Content fullWidth>
        <List>
          {routines.map(routine => (
            <RoutineItem key={routine.id} routine={routine} />
          ))}
        </List>
      </Panel.Content>
    </Panel>
  );
};

export default withRouter(
  withFragment(RoutineList, {
    data: gql`
      fragment RoutineList_data on Query {
        routines {
          id
          ...RoutineItem_routine
        }
      }
      ${RoutineItem.fragments.routine}
    `
  })
);
