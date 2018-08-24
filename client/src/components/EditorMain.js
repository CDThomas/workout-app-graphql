import React, { Fragment } from "react";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
import styled from "react-emotion";
import { Header, Title } from "../components/typography";

const Card = styled("div")`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const SetCard = ({ set }) => {
  return (
    <Card>
      <Title>{set.exercise.name}</Title>
    </Card>
  );
};

const SetList = ({ sets }) => {
  return (
    <ol>
      {sets.map(set => (
        <li key={set.id}>
          <SetCard set={set} />
        </li>
      ))}
    </ol>
  );
};

const EditorMain = ({ data }) => {
  const { routine } = data;
  return (
    <Fragment>
      <Header>{routine.name}</Header>
      <SetList sets={routine.sets} />
    </Fragment>
  );
};

export default withFragment(EditorMain, {
  data: gql`
    fragment EditorMain_data on Query {
      routine(id: $id) {
        name
        sets {
          id
          exercise {
            id
            name
          }
        }
      }
    }
  `
});
