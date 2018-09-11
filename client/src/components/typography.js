import styled from "react-emotion";

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

const Text = styled("span")`
  font-size: 14px;
  font-weight: 300;
`;

const ErrorText = styled(Text)`
  color: red;
`;

export { ErrorText, Text, Title };
