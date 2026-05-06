## Async Error Handling + try/catch + express-async-handler + Production Backend Patterns

- why async errors break Express
- why `try/catch` is needed
- `next(error)`
- express-async-handler
- centralized async error handling
- production-safe backend patterns



### Why should service layer be independent of Express?

The service layer should be independent of Express to maintain separation of concerns and loose coupling. Services should contain pure business logic so they can be reused across different controllers, APIs, or even different frameworks. This also makes the code easier to test, maintain, and scale without being tied to HTTP-specific concepts like req, res, or next.

### What happens if service uses req, res, next?

If the service layer uses `req`, `res`, or `next`, it becomes tightly coupled to Express, making it harder to reuse and test. It also mixes HTTP logic with business logic, which leads to poor architecture. This reduces flexibility because the service cannot be reused in other contexts like background jobs, different APIs, or other frameworks.

### Why Express does NOT catch async errors automatically?

Express can catch synchronous errors because they happen inside the call stack, but async errors occur outside the normal execution flow as Promise rejections, so Express cannot catch them unless we manually handle them using `next(error)` or an async wrapper.

**Key Concept 🔥**
```
Sync error → Express catches automatically
Async error → must be passed to next(error)
```

### Benefit of asyncHandler over try/catch

The main benefit of using `asyncHandler` over `try/catch` is that it eliminates repetitive boilerplate code in every controller. Instead of writing `try/catch` in each function, we wrap the controller once and it automatically catches errors and passes them to the global error handler. This results in cleaner, more readable, and maintainable code.

### What happens if DB call fails in service?

The error will be thrown from the repository or service and will automatically propagate to the controller. Since the controller is wrapped with an async handler, it will catch the error and pass it to the global error middleware using next(error), which then sends a proper response to the client.


### Why should we NOT send response (res.json) inside service layer?

We should not send responses like res.json() inside the service layer because the service layer should remain independent of Express. Its responsibility is to handle business logic and return data. The controller is responsible for handling HTTP-specific concerns like req and res.

Mixing response logic in the service layer breaks separation of concerns, creates tight coupling with Express, and makes the code harder to test, reuse, and maintain.