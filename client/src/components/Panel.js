import styled from "react-emotion";

const Panel = styled("div")`
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
  background: #fff;
  outline: none;
  width: 600px;
`;

const Header = styled("header")`
  padding: 15px 0;
  margin: 0 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Content = styled("div")(({ fullWidth = false }) => {
  return {
    overflow: "auto",
    padding: fullWidth ? "0" : "0 20px 20px 20px"
  };
});

Panel.Header = Header;
Panel.Content = Content;

export default Panel;
