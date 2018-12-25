import { test } from "ava"
import { System, Store } from "ractor"
import { CallbagStore } from "../src/CallbagStore"
import { pipe, map } from "callbag-basics"
import { createCallbagStore, CallbagReceiveBuilder } from "../src";

class Increment {
  constructor(public value: number) { }
}

test("test callbag", t => {
  t.plan(1)
  const system = new System("test")

  class CounterStore extends CallbagStore<{ value: number }> {
    state = { value: 1 }
    createReceive() {
      return this.receiveBuilder()
        .match(Increment, greeting$ => pipe(greeting$, map(greeting => ({ value: greeting.value + 1 }))))
        .build()
    }
  }
  const counterStore = new CounterStore
  system.actorOf(counterStore)
  system.dispatch(new Increment(3))

  // 3 + 1
  t.is(counterStore.state.value, 4)

})

test("test createCallbagStore", t => {
  t.plan(1)
  const system = new System("test")

  const receive = CallbagReceiveBuilder
    .create()
    .match(Increment, greeting$ => pipe(greeting$, map(greeting => ({ value: greeting.value + 1 }))))
    .build()

  const CounterStore = createCallbagStore(receive)
  const counterStore = new CounterStore
  system.actorOf(counterStore)
  system.dispatch(new Increment(3))

  // 3 + 1
  t.is(counterStore.state.value, 4)

})

