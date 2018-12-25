import { test } from "ava"
import { System, Store } from "ractor"
import { CallbagStore } from "../src/CallbagStore"
import { pipe, map } from "callbag-basics"
import { createCallbagStore, CallbagReceiveBuilder } from "../src";

test("test callbag", t => {
  t.plan(1)
  const system = new System("test")
  class Increment {
    constructor(public value: number) { }
  }

  class CounterStore extends CallbagStore<number> {
    state = 0
    createReceive() {
      return this.receiveBuilder()
        .match(Increment, greeting$ => pipe(greeting$, map(greeting => greeting.value + 1)))
        .build()
    }
  }
  const counterStore = new CounterStore
  system.actorOf(counterStore)
  system.dispatch(new Increment(3))

  // 3 + 1
  t.is(counterStore.state, 4)

})

test("test createCallbagStore", t => {
  t.plan(1)
  const system = new System("test")
  class Increment { }
  class Decrement { }

  const CounterStore = createCallbagStore(getState =>
    CallbagReceiveBuilder
      .create()
      .match(Increment, greeting$ => pipe(greeting$, map(greeting => getState() + 1)))
      .match(Decrement, greeting$ => pipe(greeting$, map(greeting => getState() - 1)))
      .build()
    , 0)
  const counterStore = new CounterStore
  system.actorOf(counterStore)
  system.dispatch(new Increment())
  system.dispatch(new Decrement())

  t.is(counterStore.state, 0)

})

