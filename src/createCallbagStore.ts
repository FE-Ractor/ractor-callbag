import { CallbagStore } from "./CallbagStore";
import { CallbagReceive } from "./CallbagReceive";

/**
 * @param createReceive 
 * @param initialState 
 */
export function createCallbagStore<S>(receive: CallbagReceive, initialState?: any): new () => CallbagStore<S> {
  return class extends CallbagStore<S> {
    public state = initialState
    public createReceive() {
      return receive
    }
  }
}
