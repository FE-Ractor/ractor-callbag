# ractor-callbag
Callbag middleware for Ractor
# Usage
```typescript
import { CallbagStore } from "ractor-callbag";
import { ChangeTab } from "./ChangeTab";
import { map, fromPromise, pipe } from "callbag-basics";
import mapPromise from "callbag-map-promise";
import switchMap from "callbag-flat-map-operator";

export class TabStore extends CallbagStore {
  state = { content: "", actionNames: [] };
  preStart() {
    this.context.system.eventStream.on("*", obj => {
      const actionNames = [...this.state.actionNames];
      actionNames.push(obj.__proto__.constructor.name);
      this.setState({ actionNames });
    });
  }
  createReceive() {
    return this.receiveBuilder()
      .match(ChangeTab, changeTab$ =>
        pipe(
          changeTab$,
          switchMap(
            changeTab =>
              changeTab.tabid === 1
                ? fromPromise(api1000())
                : fromPromise(api3000())
          ),
          map(content => ({ content }))
        )
      )
      .build();
  }
}

function api1000() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("first"), 1000);
  });
}

function api3000() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("second"), 3000);
  });
}

```

# Demo
+ [counter](https://codesandbox.io/s/qlw3vz8359)
+ [tab](https://stackblitz.com/edit/react-callbag?file=index.js)
