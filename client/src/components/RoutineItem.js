import React from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";

const RoutineItem = ({ routine }) => {
  const { id, name } = routine;
  return (
    <li>
      <Link to={`/routines/${id}`}>{name}</Link>
    </li>
  );
};

export { RoutineItem };
export default withFragment(RoutineItem, {
  routine: gql`
    fragment RoutineItem_routine on Routine {
      id
      name
    }
  `
});
