import { CallbagStore } from "./CallbagStore";
import { CallbagReceive } from "./CallbagReceive";

type CreateReceive<S> = (getState: () => S) => CallbagReceive

/**
 * @param createReceive 
 * @param initialState 
 */
export function createCallbagStore<S>(createReceive: CreateReceive<S>, initialState?: S): new () => CallbagStore<S> {
  return class extends CallbagStore<S> {
    public state = initialState as S
    public createReceive() {
      return createReceive(() => this.state)
    }
  }
}
