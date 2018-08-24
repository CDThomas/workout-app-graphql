import React from "react";
import withFragment from "../utils/withFragment";
import gql from "graphql-tag";
import SideBar from "../components/SideBar";
import List from "../components/List";
import { Header, Title } from "../components/typography";

const EditorSideBar = ({ data }) => {
  const { exercises } = data;
  return (
    <SideBar>
      <SideBar.Header>
        <Header>Exercises</Header>
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
};

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
