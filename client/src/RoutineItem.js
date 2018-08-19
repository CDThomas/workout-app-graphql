import React from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import createFragmentContainer from "./createFragmentContainer";

const RoutineItem = ({ routine }) => {
  const { id, name } = routine;
  return (
    <li>
      <Link to={`/routines/${id}`}>{name}</Link>
    </li>
  );
};

const RoutineItemContainer = createFragmentContainer(RoutineItem, {
  routine: gql`
    fragment RoutineItem_routine on Routine {
      id
      name
    }
  `
});

export { RoutineItem };
export default RoutineItemContainer;
