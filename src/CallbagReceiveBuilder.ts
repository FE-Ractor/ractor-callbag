import { IActorReceiveBuilder, Message } from "js-actor"
import { Source } from "callbag"
import { CallbagReceive } from "./CallbagReceive"
import { Listener } from "./Listener"

export class CallbagReceiveBuilder implements IActorReceiveBuilder {
  private listeners: Listener[] = []

  public match<T extends object>(message: Message<T>, callback: (obj: Source<object>) => Source<object>) {
    this.listeners.push({ message, type: "tell", callback })
    return this
  }

  public matchAny(callback: (obj: object) => any) {
    throw Error("CallbagStore does not support matchAny yet")
    this.listeners.push({ type: "tell", callback })
    return this
  }

  public build(): CallbagReceive {
    return new CallbagReceive(this.listeners)
  }
}
