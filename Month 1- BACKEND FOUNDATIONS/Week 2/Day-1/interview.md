## 🚀 Day 8 — Express.js Core + Middleware + Request Lifecycle

**Understand deeply:**

### What Express is

Express.js is a minimal and flexible web framework built on top of Node.js. It simplifies backend development by providing features like routing, middleware, request/response handling, and API creation.

### Why Express is used over raw Node.js

**Raw Node Problems**
- manual routing
- manual body parsing
- manual middleware handling
- difficult scaling
- repetitive code
**Express Solves**
- easy routing
- middleware support
- request parsing
- error handling
- cleaner architecture

### Request → Response lifecycle

Client Request

   ↓
Middleware 1

   ↓
Middleware 2

   ↓
Route Handler

   ↓
Response Sent

### Middleware

Middleware is a function that has access to req, res, and next. It executes between request and response and is used for validation, authentication, logging, parsing, etc.
`(req, res, next)`
* next()
next() passes control to the next middleware or route handler in the request-response cycle.

Without next():
request gets stuck.

### app.use()

- global middleware
- route-level middleware
- error middleware

### Route handlers
```js
function auth(req, res, next) {
  console.log("Auth check");
  next();
}

app.get("/profile", auth, (req, res) => {
  res.send("Profile Page");
});
```
### Error-handling middleware
```js
(err, req, res, next)
```

### Practical Task

Create:

`index.js`

with:

* one global middleware
* one custom auth middleware
* one route /profile
* one route /home
* one error middleware

Run and test.


### Questions And Answer

#### Q1 — app.use() vs app.get()
Ans: `app.use()` Used to register middleware globally or for specific paths. It works for all HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, etc.) unless a path is restricted.

Example:

```js
app.use(express.json());
```

`app.get()` Used specifically to handle only GET requests for a particular route.

```js
app.get("/profile", handler)
```

#### Q2 — Forgetting next()

If we forget to call `next()` and also do not send a response using `res.send()` or `res.json()`, the request gets stuck and the client keeps waiting because Express does not know how to continue the request-response cycle.

#### Q3 — express.json()

`express.json()` is built-in middleware used to parse incoming JSON request bodies and convert them into JavaScript objects available in req.body.

Without it: `req.body` will be undefined.


#### Q4 — Middleware vs Route Handler

`Middleware`: Middleware executes between request and response and is mainly used for authentication, validation, logging, parsing, etc.

`Route Handler`: Route handler is responsible for handling the final business logic and sending the response to the client.

#### Q5: Can middleware send response directly without calling next()?

Yes, middleware can send a response directly without calling next().

This is commonly done in authentication, authorization, validation, or rate-limiting middleware. If validation fails or the user is unauthorized, the middleware should immediately send a response like 401 Unauthorized or 400 Bad Request and stop further execution.

We call next() only when the request should continue to the next middleware or route handler.

```js
function auth(req, res, next) {
   if (!req.headers.token) {
      return res.status(401).json({
         message: "Unauthorized"
      });
   }

   next();
}
```