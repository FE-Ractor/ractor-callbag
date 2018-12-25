import { IActorScheduler, Message } from "js-actor"
import { Source, START, DATA, END } from "callbag"
import { CallbagStore } from "./CallbagStore"
import { System } from "ractor"
import { Listener } from "."


export type Signal = START | DATA | END

export class CallbagScheduler implements IActorScheduler {
  private handlers: Array<(messageInc?: object) => void> = []

  constructor(
    private system: System,
    private event: string,
    private listeners: Listener[],
    private owner: CallbagStore<any>
  ) { }

  public callback = (messageInc: Object) => {
    try {
      this.handlers.forEach(handler => handler(messageInc))
    } catch (e) {
      this.owner.postError(e)
    }
  }

  public cancel() {
    this.system.eventStream.removeListener(this.event, this.callback)
    this.handlers.forEach(handler => handler())
    this.handlers.length = 0
    return true
  }

  public isCancelled() {
    return !this.system.eventStream.listeners(this.event).length
  }

  public pause() {
    this.cancel()
  }

  public restart() {
    this.cancel()
    this.start()
  }

  public start() {
    this.system.eventStream.addListener(this.event, this.callback)
    this.mapListenerToCallbag(this.listeners)
  }

  public getListeners() {
    return this.listeners
  }

  public replaceListeners(listeners: Listener[]) {
    this.listeners = listeners
  }

  public ofMessage = (message: Message<object>): Source<object> => (type: Signal, sink: any) => {
    if (type === 0) {
      const handler = (messageInc?: object) => {
        if (messageInc) {
          if (messageInc instanceof message) {
            sink(1, messageInc)
          }
        } else {
          sink(2)
        }
      }
      this.handlers.push(handler)
      sink(0, (t: Signal, d: any) => {
        if (t === 2) {
          this.handlers.splice(this.handlers.indexOf(handler), 1)
        }
      })
    }
  }

  public mapListenerToCallbag(listeners: Listener[]) {
    listeners.forEach(listener => {
      const epic$ = listener.callback(this.ofMessage(listener.message))
      epic$(0, (t: Signal, d: any) => {
        if (t === 1) {
          this.owner.setState(d)
        }
      })
    })
  }

}
