import React, { Fragment } from "react";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
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
