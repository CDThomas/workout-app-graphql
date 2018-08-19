import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RoutineListPage, RoutineEditorPage } from "./pages";
import "./App.css";

const client = new ApolloClient({});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <Route exact path="/" component={RoutineListPage} />
            <Route path="/routines/:id" component={RoutineEditorPage} />
          </Switch>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
