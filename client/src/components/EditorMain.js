import React, { Fragment } from "react";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
import RoutineEditorHeader from "./RoutineEditorHeader";
import SetList from "./SetList";

const EditorMain = ({ data }) => {
  const { routine } = data;

  return (
    <Fragment>
      <RoutineEditorHeader routine={routine} />
      <SetList routine={routine} />
    </Fragment>
  );
};

export default withFragment(EditorMain, {
  data: gql`
    fragment EditorMain_data on Query {
      routine(id: $routineId) {
        ...RoutineEditorHeader_routine
        ...SetList_routine
      }
    }
    ${RoutineEditorHeader.fragments.routine}
    ${SetList.fragments.routine}
  `
});
