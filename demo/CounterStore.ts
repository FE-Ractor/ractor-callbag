import { Increment } from "./Increment";
import { Decrement } from "./Decrement";
import { CallbagStore } from "ractor-callbag";
import { pipe, map } from "callbag-basics";

export class CounterStore extends CallbagStore<{ value: number }> {
  state = { value: 1 };

  createReceive() {
    return this.receiveBuilder()
      .match(Increment, increment$ =>
        pipe(
          increment$,
          map((increment: object) => ({ value: this.state.value + 1 }))
        )
      )
      .match(Decrement, decrement$ =>
        pipe(
          decrement$,
          map((decrement: object) => ({ value: this.state.value - 1 }))
        )
      )
      .build();
  }
}
