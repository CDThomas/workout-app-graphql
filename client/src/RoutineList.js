import React, { Fragment } from "react";
import gql from "graphql-tag";
import createFragmentContainer from "./createFragmentContainer";
import RoutineItem from "./RoutineItem";

const RoutineList = ({ data }) => {
  const { routines } = data;
  return (
    <Fragment>
      <h1>Routines</h1>
      <ul>
        {routines.map(routine => (
          <RoutineItem key={routine.id} routine={routine} />
        ))}
      </ul>
    </Fragment>
  );
};

const RoutineListContainer = createFragmentContainer(RoutineList, {
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

export { RoutineList };
export default RoutineListContainer;
