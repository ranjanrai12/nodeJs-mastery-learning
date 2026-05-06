### DAY 1 — What is Node.js Really?

* What Node.js is
* Why Node is single-threaded
* Runtime vs Language
* V8 Engine basics



# Review of Your Answers

---

## Q1 Review: How Node handles 1000 users

### Your Answer:

> Node offloads async tasks to LibUV and brings them back when call stack is empty.

### Feedback:

Correct direction ✅ but one refinement:

Not **every** async task goes to LibUV thread pool.

More accurate:

> Node registers async operations with underlying system/libuv. Some tasks use OS async mechanisms directly (like network sockets), while some use libuv’s thread pool (like file system, crypto, DNS in many cases). Once complete, callbacks are queued and executed when the call stack is free.

### Why this matters

Because advanced interviewers may ask:

> “Does every async task use thread pool?”

Answer:

> No.

---

---

## Q2 Review: Why Node is fast

### Your Answer:

> Because it is event-driven and non-blocking.

Correct ✅ but incomplete.

Better interview answer:

> Node.js is fast because it uses the V8 engine, which compiles JavaScript into optimized machine code, and because of its non-blocking event-driven architecture, allowing it to handle many concurrent I/O operations efficiently without waiting.

### Key missing point:

**V8 compilation speed** is also major factor.

---

---

## Q3 Review: CPU Heavy

### Your Answer:

Good.

Need deeper explanation:

> Node is not ideal for CPU-intensive tasks because if the task takes longer time to complete then it can block the single JavaScript thread, preventing the event loop from processing other requests, which degrades performance.

Important keyword:

> **"blocks the event loop"**

Use this in interviews.

---

---

## Q4 Review: setTimeout

### Your Answer:

Good explanation.

Need one important refinement:

Even with `0ms`, timeout doesn't run instantly because:

> `setTimeout(...,0)` means "execute after minimum delay once call stack is empty and event loop processes timer queue", NOT "execute immediately."

---

# Final Concept Test (One Last Before Day 2)

Answer this carefully:

---

### Scenario:

Suppose you write:

```js id="sd2ttq"
while(true){
}
```

inside your Node server.

while(true) creates an infinite loop that permanently blocks the single JavaScript thread because the loop never exits. Since the call stack never becomes free, the event loop cannot process pending callbacks, timers, or incoming API requests. As a result, the server becomes unresponsive for all users.

### Question:

What will happen to your Node application and **why**?

---

### Bonus:

Why is this dangerous in production?

