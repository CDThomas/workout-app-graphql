import React from "react";
import { filter } from "graphql-anywhere";
import hoistNonReactStatics from "hoist-non-react-statics";

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const withFragment = (Component, fragments) => {
  const ApolloFragment = props => {
    const fragmentProps = Object.keys(fragments).reduce(
      (fragmentProps, propName) => {
        if (props[propName]) {
          fragmentProps[propName] = filter(
            fragments[propName],
            props[propName]
          );
        }
        return fragmentProps;
      },
      {}
    );
    return <Component {...props} {...fragmentProps} />;
  };

  hoistNonReactStatics(ApolloFragment, Component);
  ApolloFragment.fragments = fragments;
  ApolloFragment.displayName = `ApolloFragment(${getDisplayName(Component)})`;

  return ApolloFragment;
};

export default withFragment;
