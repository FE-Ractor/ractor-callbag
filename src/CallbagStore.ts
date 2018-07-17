import { Store } from "ractor"
import { IActorReceive } from "js-actor"
import { CallbagReceiveBuilder } from "./CallbagReceiveBuilder";
import { CallbagScheduler } from "./CallbagScheduler";

export abstract class CallbagStore<S> extends Store<S> {
  abstract createReceive(): IActorReceive

  protected receiveBuilder() {
    return new CallbagReceiveBuilder()
  }

  public receive() {
    const receive = this.createReceive()
    this.context.scheduler = new CallbagScheduler(this.context.system, this.context.path, receive.listeners, this)
    this.context.scheduler.start()
    this.preStart()
  }
}