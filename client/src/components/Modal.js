import React from "react";
import ReactModal from "react-modal";
import { MdClose } from "react-icons/md";
import styled, { css } from "react-emotion";

const modalClass = css`
  margin: 100px auto;
  -webkit-overflow-scrolling: touch;
  outline: none;
  width: fit-content;
`;

const overlayClass = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: hsla(0, 0%, 97%, 0.8);
  z-index: 999;
`;

const CloseIcon = styled(MdClose)`
  width: 25px;
  height: 25px;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  position: absolute;
  color: #fff;
`;

const CloseButton = styled("button")`
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 200;
  background-color: #bbbbbb;
  border: none;
  outline: none;
  border-radius: 50%;
  padding: 16px;
  width: 12px;
  height: 12px;
  cursor: pointer;
  &:hover {
    background-color: #0f82e6;
  }
`;

const ModalContent = styled("div")``;

// const propTypes = {
//   children: PropTypes.node.isRequired
// };

function Modal(props) {
  return (
    <ReactModal
      className={modalClass}
      overlayClassName={overlayClass}
      appElement={document.getElementById("root")}
      {...props}
    >
      <CloseButton onClick={props.onRequestClose}>
        <CloseIcon />
      </CloseButton>
      <ModalContent>{props.children}</ModalContent>
    </ReactModal>
  );
}
// Modal.propTypes = propTypes;

export default Modal;
