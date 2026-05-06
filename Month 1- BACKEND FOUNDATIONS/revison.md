- What is `Event loop`. - **Completed**

- Why can excessive use of `process.nextTick` be dangerous? - **Completed**

- `Microtask` vs `Callback Queue` - **Completed**

- What is the difference between and Which runs first? - **Completed**
    - setImmediate
    - setTimeout(fn, 0)

- What will be the output - **Completed**

```js
console.log("Start");

setTimeout(() => { console.log("setTimeout 0"); }, 0);

setTimeout(() => { console.log("setTimeout 100"); }, 100);

setImmediate(() => { console.log("setImmediate"); });

process.nextTick(() => { console.log("process.nextTick"); });

Promise.resolve().then(() => { console.log("Promise"); });

console.log("Completed");
```

```js
console.log("start");

setTimeout(() => console.log("timeout1"), 0);

setImmediate(() => console.log("immediate1"));

Promise.resolve().then(() => {
  console.log("promise1");

  setTimeout(() => console.log("timeout2"), 0);

  setImmediate(() => console.log("immediate2"));

  process.nextTick(() => console.log("nextTick inside promise"));
});

process.nextTick(() => {
  console.log("nextTick1");

  Promise.resolve().then(() => console.log("promise2"));
});

console.log("end");

/**
start
end
nextTick1
promise1
promise2
nextTick inside promise
timeout1
immediate1
immediate2
timeout2
**/

nextTick runs before microtasks, but nextTick scheduled inside a microtask runs only after the current microtask queue completes.
```

- Phases in Event loop and explain each phase does ? - **Completed**

- What if we don't define `next()` in middleware ? - **Completed**

    **🧠 Question 1 — Middleware Order (Trap)**
    ```js
    // What is the output and why?
    app.use((req, res, next) => {
    console.log("A");
    next();
    });

    app.get("/", (req, res, next) => {
    console.log("B");
    next();
    });

    app.use((req, res, next) => {
    console.log("C");
    res.send("Done");
    });

    app.use((req, res) => {
    console.log("D");
    });
    
    ```
    **🧠 Question 2 — Missing next() vs Response**
    ```js
    // What happens when you hit /?
    // Does it hang?
    // Does handler run?
    app.use((req, res, next) => {
        console.log("Middleware 1");
    });

    app.get("/", (req, res) => {
        console.log("Handler");
        res.send("Hello");
    });
    ```
    **🧠 Question 3 — Error Handling Middleware (Core)**
    ```js
    app.get("/", (req, res, next) => {
        throw new Error("Something broke");
    });

    app.use((err, req, res, next) => {
        res.status(500).send("Error handled");
    });
    ```
    **🧠 Question 4 — Async Error Trap (VERY IMPORTANT)**
    ```js
    // Will this work in Express?
    app.get("/", async (req, res, next) => {
        throw new Error("Async error");
    });

    app.use((err, req, res, next) => {
        res.status(500).send("Caught");
    });
    ```
    **🧠 Question 5 — Double Response Bug**
    ```js
    app.get("/", (req, res, next) => {
        res.send("First response");
        next();
    });

    app.use((req, res) => {
        res.send("Second response");
    });
    ```
    **🧠 Question 6 — Async Middleware Without next()**
    ```js
    // ❓ What happens when you hit /?
    app.use(async (req, res, next) => {
        await Promise.resolve();
        console.log("Async middleware");
    });

    app.get("/", (req, res) => {
        res.send("OK");
    });
    ```
    **🧠 Question 7 — Real-World Scenario**
    ```js
    // Why is this dangerous?
    // How to fix it?
    app.use(async (req, res, next) => {
        const user = await getUserFromDB();
        req.user = user;
    });
    ```

-  What all `security measures` will you take in Node JS applications - TODO: need to complete all

-  **`TODO:`** Ask me system design + event loop combo questions

- What is HTTPS vs HTTP 

## JWT + Refresh Tokens
- What is the difference between access token and refresh token?
- Where are they stored and why?
- What is token rotation?
- What happens when refresh token is stolen?
- What is token reuse detection?

## Rate Limiting
- What are the 3 algorithms?
- Difference between IP limiter and user limiter?
- What is sliding window and why better than fixed window?
- What is keyGenerator and store?

## Helmet
- What does CSP protect against?
- What does X-Frame-Options protect against?
- What is MIME sniffing?

## Security Attacks
- How does XSS work?
- How does Clickjacking work?
- How does SQL injection work?
- How does NoSQL injection work in MongoDB?