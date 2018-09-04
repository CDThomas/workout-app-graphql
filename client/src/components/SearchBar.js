import React, { Component } from "react";
import { MdSearch } from "react-icons/md";
import styled from "react-emotion";

const Form = styled("form")`
  position: relative;
  display: flex;
`;

const Input = styled("input")`
  flex: 1;
  padding: 4px 5px 4px 25px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  font-weight: 300;
  font-size: 14px;
  color: #5f5f5f;

  &::-webkit-input-placeholder {
    font-weight: 300;
    font-size: 14px;
  }
`;

const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  color: #a9a9a9;
`;

// const { string, func, bool } = PropTypes;
// const propTypes = {
//   className: string,
//   onChange: func,
//   placeholder: string,
//   autoFocus: bool
// };

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.props.onChange && this.props.onChange(evt);
  }

  handleSubmit(evt) {
    // Prevent a page refresh, but don't do anything else
    evt.preventDefault();
  }

  render() {
    const { placeholder, autoFocus } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Input
          type="text"
          placeholder={placeholder}
          onChange={this.handleChange}
          autoFocus={autoFocus}
        />
        <SearchIcon className="SearchBar__icon" />
      </Form>
    );
  }
}

export default SearchBar;
