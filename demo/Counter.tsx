import * as React from "react";
import { Connect } from "ractor-react";
import { CounterStore } from "./CounterStore";
import { system } from "./system";
import { Increment } from "./Increment";
import { Decrement } from "./Decrement";

@Connect(CounterStore)
export class Counter extends React.Component<{ value?: number }> {
  public render() {
    return (
      <p>
        Clicked: {this.props.value} times{" "}
        <button onClick={() => system.dispatch(new Increment())}>+</button>{" "}
        <button onClick={() => system.dispatch(new Decrement())}>-</button>{" "}
        <button onClick={this.incrementIfOdd}>Increment if odd</button>{" "}
        <button onClick={this.incrementAsync}>Increment async</button>
      </p>
    );
  }

  public incrementIfOdd = () => {
    if (this.props.value! % 2 === 1) {
      system.dispatch(new Increment());
    }
  };

  public incrementAsync = () => {
    setTimeout(() => system.dispatch(new Increment()), 1000);
  };
}
