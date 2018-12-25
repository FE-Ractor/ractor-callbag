import { IActor, IActorContext } from "js-actor"
import { CallbagReceiveBuilder } from "./CallbagReceiveBuilder";
import { CallbagScheduler } from "./CallbagScheduler";
import { CallbagReceive } from "./CallbagReceive";
import { System } from "ractor";

export interface StoreContext extends IActorContext {
  system: System
}

export abstract class CallbagStore<S> implements IActor {
  private listeners: Array<Listener<S> | Observer<S>> = []
  public abstract createReceive(): CallbagReceive
  public state: any
  public context!: StoreContext

  public receiveBuilder() {
    return new CallbagReceiveBuilder()
  }

  public receive() {
    const receive = this.createReceive()
    this.context.scheduler = new CallbagScheduler(this.context.system, this.context.path, receive.listeners, this)
    this.context.scheduler.start()
    this.preStart()
  }

  /** is called when actor is started*/
  public preStart() {

  }

  /** is called after getContext().stop() is invoked */
  public postStop() {

  }

  /** is called after Receive got error */
  public postError(err: Error) {
    throw err
  }

	/**
	 * listener can be function or observer of rxjs
	 * @param listener 
	 */
  public subscribe(listener: (Listener<S> | Observer<S>)): Subscription {

    if (typeof listener === "object" && listener.next) {
      this.listeners.push(listener)
      listener.next(this.state)
    } else if (typeof listener === "function") {
      this.listeners.push(listener)
      listener(this.state)
    } else {
      throw TypeError("expected the listener to be a function or observer.")
    }

    return {
      unsubscribe: () => {
        const index = this.listeners.indexOf(listener)
        this.listeners.splice(index, 1)
      }
    }
  }

	/**
	 * setState is sync.
	 *
	 * @param nextState 
	 */
  public setState(nextState: Partial<S>) {
    if (typeof nextState === "object") {
      if (typeof this.state === "object") {
        this.state = Object.assign({}, this.state, nextState)
      } else {
        this.state = nextState
      }
    } else {
      throw TypeError("takes an object of state variables to update.")
    }

    for (let listener of this.listeners) {
      if (typeof listener === "function") {
        listener(this.state)
      } else {
        listener.next(this.state)
      }
    }
  }

  public replaceState(nextState: any) {
    this.state = nextState
    for (let listener of this.listeners) {
      if (typeof listener === "function") {
        listener(this.state)
      } else {
        listener.next(this.state)
      }
    }
  }
}


export type Listener<S> = (state: S) => void
export type Observer<S> = {
  next: (state: S) => void
}
export type Subscription = {
  unsubscribe: () => void
}