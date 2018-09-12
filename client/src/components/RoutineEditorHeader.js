import React, { Component } from "react";
import RoutineNameInput from "./RoutineNameInput";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { Text, ErrorText } from "./typography";
import { Mutation } from "react-apollo";
import withFragment from "../utils/withFragment";
import gql from "graphql-tag";
import debounce from "lodash/debounce";
import styled from "react-emotion";
import { withRouter } from "react-router-dom";
import { ROUTINE_LIST_PAGE_QUERY } from "../pages/RoutineListPage";

const Header = styled("header")`
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

class RoutineEditorHeader extends Component {
  state = {
    error: null,
    name: this.props.routine.name,
    isDeleteRoutineConfirmOpen: false
  };

  handleNameChange = (evt, updateRoutineMutation) => {
    const newName = evt.target.value;
    const { id } = this.props.routine;

    this.setState({ name: newName });

    if (!newName) {
      this.doMutation.cancel();
      this.setState({ error: "Routine name can't be blank" });
      return;
    }

    this.setState({ error: null });
    this.doMutation(updateRoutineMutation, {
      variables: { input: { id, name: newName } }
    });
  };

  handleToggleConfirmationDialog = () => {
    this.setState(prevState => ({
      isDeleteRoutineConfirmOpen: !prevState.isDeleteRoutineConfirmOpen
    }));
  };

  doMutation = debounce((mutation, opts) => {
    return mutation(opts);
  }, 1000);

  hasPersisted() {
    const areChildrenPendingChanges = this.props.routine.sets
      .map(({ hasPendingChanges }) => hasPendingChanges)
      .includes(true);
    const hasNamePersisted = this.props.routine.name === this.state.name;

    return !areChildrenPendingChanges && hasNamePersisted;
  }

  renderHelperText() {
    const { error } = this.state;

    if (error) {
      return <ErrorText>{error}</ErrorText>;
    }

    return (
      <Text>{this.hasPersisted() ? "All changes saved." : "Saving..."}</Text>
    );
  }

  render() {
    const { name, isDeleteRoutineConfirmOpen } = this.state;
    const { routine, history } = this.props;

    return (
      <Header>
        <div>
          <Mutation
            mutation={gql`
              mutation UpdateRoutine($input: UpdateRoutineInput!) {
                updateRoutine(input: $input) {
                  id
                  name
                }
              }
            `}
          >
            {updateRoutine => {
              return (
                <RoutineNameInput
                  value={name}
                  onChange={evt => this.handleNameChange(evt, updateRoutine)}
                />
              );
            }}
          </Mutation>
          {this.renderHelperText()}
        </div>
        <Button onClick={this.handleToggleConfirmationDialog} color="red">
          Delete Routine
        </Button>
        <Mutation
          mutation={gql`
            mutation DeleteRoutine($id: ID!) {
              deleteRoutine(id: $id) {
                id
              }
            }
          `}
          variables={{ id: routine.id }}
          optimisticResponse={{
            __typename: "Mutation",
            deleteRoutine: {
              __typename: "Routine",
              id: routine.id
            }
          }}
          update={(cache, { data: { deleteRoutine } }) => {
            const data = cache.readQuery({
              query: ROUTINE_LIST_PAGE_QUERY
            });

            data.routines = data.routines.filter(
              routine => routine.id !== deleteRoutine.id
            );

            cache.writeQuery({
              query: ROUTINE_LIST_PAGE_QUERY,
              data
            });
          }}
        >
          {deleteRoutine => {
            return (
              <ConfirmDialog
                text="Are you sure you want to delete this routine?"
                confirmButtonText="Delete"
                confirmButtonColor="red"
                isOpen={true}
                isOpen={isDeleteRoutineConfirmOpen}
                onConfirm={() => {
                  deleteRoutine();
                  history.push("/routines");
                }}
                onCancel={this.handleToggleConfirmationDialog}
                onRequestClose={this.handleToggleConfirmationDialog}
              />
            );
          }}
        </Mutation>
      </Header>
    );
  }
}

export default withRouter(
  withFragment(RoutineEditorHeader, {
    routine: gql`
      fragment RoutineEditorHeader_routine on Routine {
        id
        name
        sets {
          hasPendingChanges @client
        }
      }
    `
  })
);
