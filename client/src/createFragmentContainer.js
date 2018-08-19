import React from "react";
import { filter } from "graphql-anywhere";

// TODO: Filter out data that parent fragments don't need, but their children do

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const createFragmentContainer = (Component, fragments) => {
  const FragmentContainer = props => {
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
  FragmentContainer.fragments = fragments;
  FragmentContainer.displayName = `FragmentContainer(${getDisplayName(
    Component
  )})`;

  return FragmentContainer;
};

export default createFragmentContainer;
