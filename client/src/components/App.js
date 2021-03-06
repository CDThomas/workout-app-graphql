import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { RoutineListPage, RoutineEditorPage } from "../pages";
import HeaderNav from "./HeaderNav";
import styled from "react-emotion";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  clientState: {
    resolvers: {
      RoutineSet: {
        hasPendingChanges: () => false
      },
      Mutation: {
        updatePendingChanges: (
          _,
          { hasPendingChanges, routineSetId },
          { cache }
        ) => {
          cache.writeData({
            id: `RoutineSet:${routineSetId}`,
            data: { hasPendingChanges }
          });

          return { updatePendingChanges: { hasPendingChanges, routineSetId } };
        }
      }
    }
  }
});

const Main = styled("main")`
  position: relative;
  padding-top: 50px;
  z-index: 0;
`;

const Wrapper = styled("div")`
  background-color: #f9f9f9;
  min-height: 100%;
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Wrapper>
            <HeaderNav />
            <Main>
              <Switch>
                <Redirect exact from="/" to="/routines" />
                <Route exact path="/routines" component={RoutineListPage} />
              </Switch>
              <Route path="/routines/:id" component={RoutineEditorPage} />
            </Main>
          </Wrapper>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
