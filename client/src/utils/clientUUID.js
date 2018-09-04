import uuid from "uuid/v4";

export default function() {
  return `client:${uuid()}`;
}
