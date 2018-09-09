import React from "react";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
import SetCard from "./SetCard";

const SetList = ({ routine }) => {
  const { sets, id: routineId } = routine;

  return (
    <ul>
      {sets.map(set => (
        <li key={set.id}>
          <SetCard set={set} routineId={routineId} />
        </li>
      ))}
    </ul>
  );
};

export default withFragment(SetList, {
  routine: gql`
    fragment SetList_routine on Routine {
      id
      sets {
        id
        ...SetCard_set
      }
    }
    ${SetCard.fragments.set}
  `
});
