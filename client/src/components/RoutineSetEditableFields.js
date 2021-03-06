import React, { Component } from "react";
import gql from "graphql-tag";
import styled from "react-emotion";
import { Mutation } from "react-apollo";
import debounce from "lodash/debounce";

const Input = styled("input")`
  background: none;
  border: none;
  border-bottom: 1px solid #999;
  font-size: 16px;
  color: #999;
  padding: 0 0 2px 0;
  width: 24px;
  text-align: center;
  &:focus {
    outline: none;
  }
`;

const Label = styled("label")`
  font-weight: 400;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #999;
  padding: 0 5px;
`;

const UPDATE_PENDING_CHANGES = gql`
  mutation updatePendingChanges(
    $hasPendingChanges: Boolean!
    $routineSetId: ID!
  ) {
    updatePendingChanges(
      hasPendingChanges: $hasPendingChanges
      routineSetId: $routineSetId
    ) @client
  }
`;

class RoutineSetEditableFields extends Component {
  state = {
    setCount: this.props.setCount,
    repCount: this.props.repCount
  };

  doMutation = debounce((mutation, opts, id, client) => {
    return mutation(opts).then(() => {
      client.mutate({
        mutation: UPDATE_PENDING_CHANGES,
        variables: { hasPendingChanges: false, routineSetId: id }
      });
    });
  }, 1000);

  onChange = async (evt, updateRoutineSetMutation, client) => {
    const { name, value } = evt.target;
    const { id } = this.props;

    this.setState({
      [name]: value
    });

    const valueAsInt = parseInt(value, 10);
    const otherFieldName = name === "setCount" ? "repCount" : "setCount";
    const otherFieldAsInt = parseInt(this.state[otherFieldName], 10);
    if (!valueAsInt || !otherFieldAsInt) return;
    if (
      valueAsInt < 0 ||
      valueAsInt > 99 ||
      otherFieldAsInt < 0 ||
      otherFieldAsInt > 99
    ) {
      return;
    }

    await client.mutate({
      mutation: UPDATE_PENDING_CHANGES,
      variables: { hasPendingChanges: true, routineSetId: id }
    });

    const fields = {};
    fields[name] = valueAsInt;
    fields[otherFieldName] = otherFieldAsInt;

    this.doMutation(
      updateRoutineSetMutation,
      {
        variables: { input: { id, ...fields } }
      },
      id,
      client
    );
  };

  onSubmit = evt => {
    evt.preventDefault();
  };

  render() {
    const { setCount, repCount } = this.state;

    return (
      <Mutation
        mutation={gql`
          mutation UpdateRoutineSet($input: UpdateRoutineSetInput!) {
            updateRoutineSet(input: $input) {
              id
              setCount
              repCount
            }
          }
        `}
      >
        {(updateRoutineSet, { client }) => {
          return (
            <form onSubmit={this.onSubmit}>
              <Input
                type="text"
                name="setCount"
                value={setCount}
                onChange={evt => this.onChange(evt, updateRoutineSet, client)}
              />
              <Label htmlFor="setCount">sets, </Label>
              <Input
                type="text"
                name="repCount"
                value={repCount}
                onChange={evt => this.onChange(evt, updateRoutineSet, client)}
              />
              <Label htmlFor="repCount">reps</Label>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

export default RoutineSetEditableFields;
