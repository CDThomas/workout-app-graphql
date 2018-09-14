import React, { Component } from "react";
import withFragment from "../utils/withFragment";
import Modal from "./Modal";
import Panel from "./Panel";
import Field from "./Field";
import Label from "./Label";
import Input from "./Input";
import Button from "./Button";
import { Title } from "./typography";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import clientUUID from "../utils/clientUUID";
import { ROUTINE_EDITOR_QUERY } from "../pages/RoutineEditorPage";
import { withRouter } from "react-router-dom";
import capitalize from "lodash/capitalize";
import styled from "react-emotion";

// TODO: handle exercise edits
// TODO: loading icon and better loading experience
//   - disable inputs and submit button while submitting

// const propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onRequestClose: PropTypes.func.isRequired,
//   onExerciseCreated: PropTypes.func.isRequired
// };

const Select = styled("select")`
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
`;

class CreateExerciseModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      mainMuscleWorked: props.data.muscles[0].id,
      // errors: [],
      isSubmitting: false
    };

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleRequestClose() {
    // Resest form state
    this.setState({
      // errors: [],
      name: ""
      // mainMuscleWorkedId: this.state.muscleOptions.length
      //   ? this.state.muscleOptions[0].id
      //   : null
    });

    // Call cb from parent
    this.props.onRequestClose();
  }

  handleInputChange(evt) {
    const newState = {};
    newState[evt.target.name] = evt.target.value;
    this.setState(newState);
  }

  renderForm({ createExercise }) {
    const handleSubmit = evt => {
      evt.preventDefault();
      const { name, mainMuscleWorked } = this.state;
      this.setState({ isSubmitting: true });

      // TODO: better feedback for validation
      if (!name) {
        return;
      }

      createExercise({
        variables: { input: { name, mainMuscleWorkedId: mainMuscleWorked } }
      });

      // Previous implementation logic
      // createExercise({ name, mainMuscleWorkedId })
      //   .then(response => {
      //     // reset form state
      //     this.setState({
      //       errors: [],
      //       name: "",
      //       mainMuscleWorkedId: this.state.muscleOptions[0].id
      //     });

      //     // Call cb from parent
      //     this.props.onExerciseCreated(response.exercise);
      //   })
      //   .catch(error => {
      //     const response = error.response;
      //     if (response && response.status === 422) {
      //       response.json().then(body => {
      //         this.setState({ errors: body.errors });
      //       });
      //     } else {
      //       console.error(error);
      //     }
      //   })
      //   .then(() => this.setState({ isSubmitting: false }));
    };

    return (
      <form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name">Exercise name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Ex: Bench press"
            onChange={this.handleInputChange}
            value={this.state.name}
            autoFocus
          />
        </Field>
        <Field>
          <Label htmlFor="mainMuscleWorked">Main muscle worked</Label>
          <Select
            name="mainMuscleWorked"
            onChange={this.handleInputChange}
            value={this.state.mainMuscleWorked}
          >
            {this.props.data.muscles.map(muscle => {
              const { id, name } = muscle;
              return (
                <option key={id} value={id}>
                  {capitalize(name)}
                </option>
              );
            })}
          </Select>
        </Field>
        {/* {this.state.errors.length > 0 &&
          <Message
            error
            header={
              this.state.errors.length > 1
                ? 'There were some errors with your submission:'
                : 'There was an error with your submission:'
            }
            list={this.state.errors.map(err => err.message)}
          />} */}
        <Button type="submit" floated="right">
          Create
        </Button>
      </form>
    );
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel="Create exercise modal"
        onRequestClose={this.handleRequestClose}
      >
        <Panel>
          <Panel.Header>
            <Title weight="medium">New Exercise</Title>
          </Panel.Header>
          <Panel.Content>
            {" "}
            <Mutation
              mutation={gql`
                mutation CreateExercise($input: CreateExerciseInput!) {
                  createExercise(input: $input) {
                    __typename
                    id
                    name
                    mainMuscleWorked {
                      __typename
                      id
                      name
                    }
                  }
                }
              `}
              onCompleted={this.handleRequestClose}
              optimisticResponse={{
                __typename: "Mutation",
                createExercise: {
                  __typename: "Exercise",
                  id: clientUUID(),
                  name: this.state.name,
                  mainMuscleWorked: {
                    __typename: "Muscle",
                    id: this.state.mainMuscleWorked,
                    name: this.props.data.muscles.find(
                      muscle => muscle.id === this.state.mainMuscleWorked
                    ).name
                  }
                }
              }}
              update={(cache, { data: { createExercise } }) => {
                // XXX: This works but it sucks. This component shouldn't know
                // about the routine id. Maybe the parent can provide a cach updater
                // func? Maybe this whole updater should be passed down from the
                // parent that knows about its own data.
                const routineId = this.props.match.params.id;

                const data = cache.readQuery({
                  query: ROUTINE_EDITOR_QUERY,
                  variables: { routineId }
                });

                data.exercises = [createExercise, ...data.exercises];

                cache.writeQuery({
                  query: ROUTINE_EDITOR_QUERY,
                  variables: { routineId },
                  data
                });
              }}
            >
              {(createExercise, response) =>
                this.renderForm({ createExercise, response })
              }
            </Mutation>
          </Panel.Content>
        </Panel>
      </Modal>
    );
  }
}
// CreateExerciseModal.propTypes = propTypes;

export default withRouter(
  withFragment(CreateExerciseModal, {
    data: gql`
      fragment CreateExerciseModal_data on Query {
        muscles {
          id
          name
        }
      }
    `
  })
);
