import { Source } from "callbag"

export type Listener<T = object> = {
  message?: new (...args: any[]) => T
  callback(source: Source<T>): Source<object>
}