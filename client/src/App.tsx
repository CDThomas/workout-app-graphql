import * as React from "react";
import "./App.css";

class App extends React.Component {
  public state = { data: null };

  public componentDidMount() {
    fetch("/graphql?query={routines{id,name}}")
      .then(data => data.json())
      .then(data => {
        this.setState({ data });
      });
  }

  public render() {
    return (
      <div>
        <pre>
          <code>{JSON.stringify(this.state.data, null, 2)}</code>
        </pre>
      </div>
    );
  }
}

export default App;
