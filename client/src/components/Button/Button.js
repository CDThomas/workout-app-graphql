import React from "react";
import { cx } from "react-emotion";
import "./styles.css";

// const { node, func, string, oneOf, bool } = PropTypes
// const propTypes = {
//   children: node.isRequired,
//   onClick: func,
//   type: string,
//   disabled: bool,
//   className: string,
//   floated: oneOf(['left', 'right']),
//   size: oneOf(['small', 'medium']),
//   color: oneOf(['blue', 'white', 'red'])
// }

const defaultProps = {
  size: "medium",
  color: "blue"
};

function Button(props) {
  const { disabled, type, onClick } = props;

  const btnClass = cx(
    "Button",
    `Button--${props.size}`,
    `Button--${props.color}`,
    { "Button--floatedRight": props.floated === "right" },
    { "Button--disabled": props.disabled },
    props.className
  );

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={btnClass}
    >
      {props.children}
    </button>
  );
}
// Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
