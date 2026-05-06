### DAY 3 — Async Nature of Node

**Learn:**
* Blocking vs Non-blocking
* Async operations
* Why Node is fast

* readFile() vs readFileSync()
* Why sync is dangerous in backend servers
* Why Promise ≠ multi-threading

#### Blocking vs Non-blocking

Blocking means the current operation prevents further execution until it completes.
Non-blocking means the program can continue executing other tasks without waiting for that operation to finish.

#### Sync vs Async
Synchronous execution means tasks run one after another in sequence, and the next task waits until the current one finishes.

Asynchronous execution means long-running tasks can be delegated to the runtime, allowing the program to continue without waiting immediately.



fs.readFileSync() **blocks** the single JavaScript thread until the file operation completes. During that time, the event loop cannot process other incoming requests, timers, or callbacks. In an API server handling many users, this can make the server slow or unresponsive.

#### Q: If async is always better, then why does Node still provide sync methods?

async is **not always better**—it depends on the use case.


Async is preferred for server-side operations because it does not blocks the event loop and improves scalability. However, sync methods are useful during application startup, small scripts, CLI tools, and situations where sequential execution is required. Node provides both because both have valid use cases depending on performance needs and code simplicity.

#### Q: fs.readFile vs fs.readFileSync which is better for production

fs.readFile() is better for production backend because it is asynchronous and does not block the event loop. This allows the server to continue handling multiple user requests efficiently, improving scalability and responsiveness.

#### Q: Why does Node still provide sync methods?

Node provides synchronous methods because not every use case requires high concurrency. For startup scripts, CLI tools, configuration loading, build scripts, or one-time execution tasks, synchronous code is simpler and easier to reason about. In these cases, blocking is acceptable because performance under concurrent load is not critical.

#### Q: Is Promise automatically multi-threaded?
No, Promise does not create a new thread and it is not automatically multi-threaded. A Promise is just a JavaScript object used to manage the result of an asynchronous operation.

The actual async work (like file reading, network requests, database calls) is handled by the runtime such as libuv, OS APIs, or browser APIs. Promise only provides a cleaner way to handle success/failure compared to callbacks.

Promise callbacks (`.then`, `.catch`) are executed in the microtask queue, not in a separate thread.

#### Q: When is it okay to use fs.readFileSync()?

It is okay to use `fs.readFileSync()` in startup scripts, configuration loading, CLI tools, build scripts, or one-time execution tasks where blocking is acceptable and the next step depends on the file content immediately.