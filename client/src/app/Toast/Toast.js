import { useTimeout } from "../hooks/useTimeout";

export const Toast = (props) => {
  useTimeout(props.close, 5000);
  return null;
};
