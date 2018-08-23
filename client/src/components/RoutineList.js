import React from "react";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
import RoutineItem from "./RoutineItem";
import Panel from "./Panel";
import List from "./List";
import { Header } from "./typography";

const RoutineList = ({ data }) => {
  const { routines } = data;
  return (
    <Panel>
      <Panel.Header>
        <Header>Routines</Header>
      </Panel.Header>
      <Panel.Content>
        <List>
          {routines.map(routine => (
            <RoutineItem key={routine.id} routine={routine} />
          ))}
        </List>
      </Panel.Content>
    </Panel>
  );
};

export { RoutineList };
export default withFragment(RoutineList, {
  data: gql`
    fragment RoutineList_data on Query {
      routines {
        id
        ...RoutineItem_routine
      }
    }
    ${RoutineItem.fragments.routine}
  `
});
