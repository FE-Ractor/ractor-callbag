import { Source } from "callbag"

export type Listener<T = object, Y = "tell" | "ask"> = {
  message?: new (...args: any[]) => T
  type: Y
  callback(source: Source<T>): Source<object>
}
