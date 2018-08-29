import styled from "react-emotion";

const Header = styled("h1")`
  font-size: 20px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: 0.2px;
`;

const Title = styled("span")(({ weight = "light" }) => {
  const fontWeights = {
    light: 200,
    medium: 400
  };

  return {
    fontWeight: fontWeights[weight],
    fontSize: "20px",
    lineHeight: "20px",
    letterSpacing: "0.2px"
  };
});

export { Header, Title };
