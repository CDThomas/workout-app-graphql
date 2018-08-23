import styled from "react-emotion";

const Container = styled("div")(({ centered }) => ({
  display: "flex",
  justifyContent: centered ? "center" : "flex-start"
}));

export default Container;
