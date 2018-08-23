import styled from "react-emotion";

const SideBar = styled("div")`
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
  background: #fff;
  outline: none;
  width: 420px;
  /* Subtract header nav height to for proper scrolling in SideBar.Content */
  height: calc(100% - 50px);
  position: fixed;
`;

const Header = styled("header")`
  padding: 15px 0;
  margin: 0 20px;
  height: 80px;
  box-sizing: border-box;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Content = styled("div")`
  /* Subtract sidebar header height to for proper scrolling */
  height: calc(100% - 80px);
  overflow-y: scroll;
`;

SideBar.Header = Header;
SideBar.Content = Content;

export default SideBar;
