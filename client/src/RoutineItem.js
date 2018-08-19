import React from "react";
import gql from "graphql-tag";
import createFragmentContainer from "./createFragmentContainer";

const RoutineItem = ({ routine }) => {
  const { name } = routine;
  return (
    <li>
      <p>{`Name: ${name}`}</p>
    </li>
  );
};

const RoutineItemContainer = createFragmentContainer(RoutineItem, {
  routine: gql`
    fragment RoutineItem_routine on Routine {
      name
    }
  `
});

export { RoutineItem };
export default RoutineItemContainer;
