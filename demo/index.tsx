import * as React from "react";
import { render } from "react-dom";
import { Provider } from "ractor-react";
import { system } from "./system";
import { Counter } from "./Counter";

render(
  <Provider system={system}>
    <Counter />
  </Provider>,
  document.getElementById("root")
);
