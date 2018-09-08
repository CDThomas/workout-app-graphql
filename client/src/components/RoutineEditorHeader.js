import React, { Component } from "react";
import RoutineNameInput from "./RoutineNameInput";
import { Text, ErrorText } from "./typography";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash/debounce";
import styled from "react-emotion";

const Header = styled("header")`
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
`;

class RoutineEditorHeader extends Component {
  state = {
    error: null,
    name: this.props.routine.name
  };

  handleNameChange = (evt, updateRoutineMutation) => {
    const newName = evt.target.value;
    const { id } = this.props.routine;

    this.setState({ name: newName });

    if (!newName) {
      this.doMutation.cancel();
      this.state.error = "Routine name can't be blank";
      return;
    }

    this.setState({ error: null });
    this.doMutation(updateRoutineMutation, {
      variables: { input: { id, name: newName } }
    });
  };

  doMutation = debounce((mutation, opts) => {
    return mutation(opts);
  }, 1000);

  hasPersisted() {
    return this.props.routine.name === this.state.name;
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
    const { name } = this.state;

    return (
      <Header>
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
      </Header>
    );
  }
}

export default RoutineEditorHeader;
