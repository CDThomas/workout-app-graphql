import React from "react";
import Modal from "./Modal";
import Panel from "./Panel";
import Button from "./Button";
import { Title } from "./typography";
import styled from "react-emotion";

// const propTypes = {
//   isOpen: bool,
//   text: string,
//   confirmButtonText: string,
//   confirmButtonColor: oneOf(['blue', 'white', 'red']),
//   onRequestClose: func,
//   onConfirm: func,
//   onCancel: func
// }

const ButtonWrapper = styled("div")`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  & > * {
    margin-left: 10px;
  }
`;

const defaultProps = {
  text: "Are you sure?",
  confirmButtonColor: "blue",
  confirmButtonText: "Yes"
};

function ConfirmDialog(props) {
  const {
    isOpen,
    text,
    onRequestClose,
    onConfirm,
    onCancel,
    confirmButtonColor,
    confirmButtonText
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Confirmation dialog"
      onRequestClose={onRequestClose}
    >
      <Panel>
        <Panel.Header>
          <Title>{text}</Title>
        </Panel.Header>
        <Panel.Content>
          <ButtonWrapper>
            <Button color="white" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm} color={confirmButtonColor}>
              {confirmButtonText}
            </Button>
          </ButtonWrapper>
        </Panel.Content>
      </Panel>
    </Modal>
  );
}
ConfirmDialog.defaultProps = defaultProps;

export default ConfirmDialog;
