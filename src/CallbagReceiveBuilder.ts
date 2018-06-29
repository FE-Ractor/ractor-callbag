import { IActorReceiveBuilder, ActorReceive, Message, IActorReceive } from "js-actor"
import { Source } from "callbag"
import { CallbagReceive } from "./CallbagReceive"
import { Listener } from "./Listener"

export class CallbagReceiveBuilder implements IActorReceiveBuilder {
  private listeners: Listener[] = []

  public match<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>, Message<T10>], callback: (obj: Source<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10>) => Source<object>): this
  public match<T1, T2, T3, T4, T5, T6, T7, T8, T9>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>], callback: (obj: Source<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>) => Source<object>): this
  public match<T1, T2, T3, T4, T5, T6, T7, T8>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>], callback: (obj: Source<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>) => Source<object>): this
  public match<T1, T2, T3, T4, T5, T6, T7>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>], callback: (obj: Source<T1 | T2 | T3 | T4 | T5 | T6 | T7>) => Source<object>): this
  public match<T1, T2, T3, T4, T5, T6>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>], callback: (obj: Source<T1 | T2 | T3 | T4 | T5 | T6>) => Source<object>): this
  public match<T1, T2, T3, T4, T5>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>], callback: (obj: Source<T1 | T2 | T3 | T4 | T5>) => Source<object>): CallbagReceiveBuilder
  public match<T1, T2, T3, T4>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>], callback: (obj: Source<T1 | T2 | T3 | T4>) => Source<object>): this
  public match<T1, T2, T3>(messages: [Message<T1>, Message<T2>, Message<T3>], callback: (obj: Source<T1 | T2 | T3>) => Source<object>): this
  public match<T1, T2>(messages: [Message<T1>, Message<T2>], callback: (obj: Source<T1 | T2>) => Source<object>): this
  public match<T1>(messages: [Message<T1>], callback: (obj: Source<T1>) => Source<object>): this
  public match<T>(messages: Message<T>, callback: (obj: Source<T>) => Source<object>): this
  public match<T extends object>(message: Message<T> | Message<object>[], callback: (obj: Source<object>) => Source<object>) {
    if (Array.isArray(message)) {
      message.forEach(message => this.listeners.push({ message, callback }))
    } else {
      this.listeners.push({ message, callback })
    }
    return this
  }

  public matchAny(callback: (obj: Source<object>) => Source<object>) {
    this.listeners.push({ callback })
    return this
  }

  public build(): IActorReceive {
    return new CallbagReceive(this.listeners)
  }
}
