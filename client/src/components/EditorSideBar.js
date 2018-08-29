import React, { Component } from "react";
import withFragment from "../utils/withFragment";
import gql from "graphql-tag";
import styled from "react-emotion";
import SideBar from "./SideBar";
import CreateExerciseModal from "./CreateExerciseModal";
import List from "./List";
import { Title } from "./typography";

const Button = styled("button")`
  font-size: 14px;
  font-weight: 400;
  color: #005eaf;
  border: none;
  outline: none;
  text-decoration: underline;
  cursor: pointer;
`;

class EditorSideBar extends Component {
  state = {
    isModalOpen: false
  };

  handleCreateExerciseClick = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen
    }));
  };

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  render() {
    const { isModalOpen } = this.state;
    const { data } = this.props;
    const { exercises } = data;
    return (
      <SideBar>
        <SideBar.Header>
          <Title weight="medium">Exercises</Title>
          <Button onClick={this.handleCreateExerciseClick}>create one</Button>
          <CreateExerciseModal
            isOpen={isModalOpen}
            onRequestClose={this.handleCloseModal}
            onExerciseCreated={this.handleExerciseCreated}
          />
        </SideBar.Header>
        <SideBar.Content>
          <List>
            {exercises.map(exercise => (
              <List.Item key={exercise.id}>
                <Title>{exercise.name}</Title>
              </List.Item>
            ))}
          </List>
        </SideBar.Content>
      </SideBar>
    );
  }
}

export default withFragment(EditorSideBar, {
  data: gql`
    fragment EditorSideBar_data on Query {
      exercises {
        id
        name
      }
    }
  `
});
