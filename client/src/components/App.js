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
import { css } from "react-emotion";

const client = new ApolloClient({});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div
            className={css`
              background-color: #f9f9f9;
              min-height: 100%;
            `}
          >
            <HeaderNav />
            <div
              className={css`
                position: relative;
                padding-top: 50px;
                z-index: 0;
              `}
            >
              <Switch>
                <Redirect exact from="/" to="/routines" />
                <Route exact path="/routines" component={RoutineListPage} />
              </Switch>
              <Route path="/routines/:id" component={RoutineEditorPage} />
            </div>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
