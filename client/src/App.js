import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    fetch("/graphql?query={routines{id,name}}")
      .then(data => data.json())
      .then(data => {
        this.setState((prevState, props) => {
          return { data };
        });
      });
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {data ? (
          <pre>
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default App;
