### DAY 2 — Event Loop + Call Stack

* Call stack
* Web APIs
* Event loop
* Microtasks vs macrotasks
* nextTick vs Promise
* setTimeout vs setImmediate
* Execution order traps

### Q: What is Event loop
The event loop is responsible for managing asynchronous execution in Node.js. It continuously checks if the call stack is empty and then processes callbacks from different queues.

It works in phases such as timers, poll, check, and close. After each phase, Node processes microtasks like process.nextTick and Promise callbacks before moving to the next phase.

Microtasks have higher priority than regular callback queue tasks, which is why they execute first.

### Phases in Event loop and explain each phase does ?

**Phase 1 — Timers**

Executes callbacks scheduled by setTimeout() and setInterval() **whose threshold has expired**. The threshold is a minimum, not a guarantee — if the poll phase is busy, timers fire late.

```js
setTimeout(() => console.log('timer'), 0); // fires here
```

**Phase 2 — Pending callbacks**

Runs I/O callbacks that were deferred to the next iteration — mostly error callbacks from failed TCP connections (e.g., ECONNREFUSED). Normal I/O callbacks do not go here; they go through poll.

**Phase 3 — Idle / Prepare**

Internal use only. Node.js uses this phase to do housekeeping before entering the poll phase. You cannot hook into it from userland.

**Phase 4 — Poll ⭐ (most important)**

The heart of the loop. Two responsibilities:
- Calculates how long to block waiting for new I/O events.
- Processes I/O callbacks — file reads, network responses, DB results, etc.

If there are setImmediate callbacks queued, poll does not block — it hands off to the check phase immediately. Otherwise it blocks until a timer threshold is reached or an I/O event arrives.

```js
fs.readFile('file.txt', cb); // cb executes in poll phase
```
**Phase 5 — Check**

Executes setImmediate() callbacks. Always runs right after poll drains, making it predictable for "run after this I/O" patterns.

```js
setImmediate(() => console.log('check phase'));
```

**Phase 6 — Close callbacks**

Handles 'close' events for abruptly closed resources.

```js
socket.on('close', () => console.log('cleanup here'));
```

**Microtask Queue (between every phase)**

Not technically a phase, but critical to understand. **After each phase** (and after every single callback within a phase in Node 11+), Node drains two queues before moving on:

1. `process.nextTick()` queue — highest priority
2. `Promise` microtasks (.then, async/await resolutions)

```js
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

// Output order:
// nextTick  ← drained first
// promise   ← then promise microtasks
// timer     ← finally the timers phase
```

`process.nextTick` fires before Promises, both fire before the next event loop phase — this is a common gotcha in interviews.

#### Q: Why can excessive use of process.nextTick be dangerous?

Excessive use of **process.nextTick** can cause starvation because its callbacks are executed before the **event loop** proceeds to the next phase. If process.nextTick keeps scheduling more nextTick callbacks, the event loop never gets a chance to process I/O or timer callbacks, effectively blocking the system.

#### Q: Microtask vs Callback Queue

Microtask queue contains high-priority callbacks like process.nextTick and Promise handlers, and it is processed immediately after the current operation completes and before moving to the next event loop phase.

Callback queue (or macrotask queue) contains tasks like setTimeout, setInterval, and I/O callbacks, which are processed in different phases of the event loop.

#### Q: What is the difference between:

* setImmediate
* setTimeout(fn, 0)

Which runs first?

Ans: The execution order between setTimeout(fn, 0) and setImmediate is not guaranteed. It depends on the timing of the event loop phases. However, inside an I/O callback, setImmediate is usually executed before setTimeout.