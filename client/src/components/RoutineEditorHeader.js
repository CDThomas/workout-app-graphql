import React, { Component, Fragment } from "react";
import RoutineNameInput from "./RoutineNameInput";
import { Text } from "./typography";
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
    loading: false
  };

  doMutation = debounce((mutation, opts) => {
    return mutation(opts).then(() => this.setState({ loading: false }));
  }, 1000);

  render() {
    const {
      routine: { name, id }
    } = this.props;
    const { loading } = this.state;

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
              <Fragment>
                <RoutineNameInput
                  name={name}
                  onChange={newName => {
                    this.setState({ loading: true });

                    this.doMutation(updateRoutine, {
                      variables: { input: { id, name: newName } }
                    });
                  }}
                />
                {/*
                  This check is naive, but works for now. This could be extended
                  to use apollo-link-state to track if there are pending changes
                  at the top level of the routine, or any of the sets.
                  TODO: try using apollo link state to track pending changes here,
                  pending deletions, or pending set/rep count changes.
                */}
                <Text>{loading ? "Saving..." : "All changes saved."}</Text>
              </Fragment>
            );
          }}
        </Mutation>
      </Header>
    );
  }
}

export default RoutineEditorHeader;
