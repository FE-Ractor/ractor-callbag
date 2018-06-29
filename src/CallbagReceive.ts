import { IActorReceive } from "js-actor"
import { Listener } from "./Listener"

export class CallbagReceive implements IActorReceive {
  constructor(public listeners: Listener[]) { }
}