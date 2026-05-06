## 🚀 Day 17 — Rate Limiting + API Security

### What is rate limiting

It means that `Restricting` the number of requests a client can make in a given time.

Example: `5 requests per minute per IP`

### Prevent brute-force attacks

### Protect login APIs

### Handle abuse

#### 🔥 Where to Use Rate Limiting?
**🔐 High Priority Routes**
- login
- signup
- refresh token
- password reset    

**⚠️ Medium Priority**
- search APIs
- public APIs

### 🧠 Types of Rate Limiting

1. IP-based
2. User-based
3. Global


#### Q1: Why rate limiting is needed ?

Rate limiting is used to protect APIs from abuse such as brute-force attacks, denial-of-service (DoS), and excessive usage. It ensures fair usage and maintains system stability under high traffic.


1. `Abuse` - Being a Bad User, Using your API in ways it wasn't intended, beyond normal usage.
2. `Brute-Force Attacks` - Trying Every Password, An attacker tries millions of password combinations to break into an account.
3. `Denial of Service (DoS)` - Overwhelming server with so many requests that it can't serve real users.

#### Q2: Where to apply rate limiting?

Rate limiting should be applied on `sensitive endpoints` like login, signup, refresh token, and password reset APIs, as well as public APIs that can be abused.

#### Q3: How to handle rate limiting in distributed systems?

In distributed systems, multiple servers handle requests, so in-memory rate limiting fails. To solve this, we use a shared store like Redis to track request counts across all instances, ensuring consistent rate limiting.

#### Q4: Difference between throttling and rate limiting?

#### Q5: What happens if attacker uses multiple IPs to bypass rate limiting?

IP-based rate limiting can be bypassed if attackers use multiple IPs. To prevent this, we combine it with user-based rate limiting, CAPTCHA, and account-level restrictions to detect and block suspicious behavior.

### 🛡️ What is Helmet?

helmet is a middleware that helps secure application by setting various HTTP security headers

`It protects against:`
- XSS (Cross-site scripting)
- Clickjacking
- MIME sniffing
- Data injection attacks

***XSS (Cross-site scripting)***: 

A vulnerability where an attacker injects malicious JavaScript into your application, which runs in another user’s browser.

😈 What attacker can do
- steal JWT tokens
- access cookies
- act as user

***Clickjacking***:Attacker loads your website inside an invisible iframe on their page, then overlays their own UI on top. User thinks they are clicking on the attacker's page — they are actually clicking on your site underneath.

***MIME sniffing***

It means the web browser ignores the official Content-Type header sent by the server and instead examines the actual content (the first few bytes) of the file to determine what it is.

***Data injection attacks***
attacker's data is treated as code or commands instead of plain data.

- `SQL Injection`
```js
// Your code — VULNERABLE
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;

// Attacker inputs as email:
// ' OR '1'='1

// Query becomes:
// SELECT * FROM users WHERE email = '' OR '1'='1'
// '1'='1' is always true → returns ALL users
// Attacker gets entire user table

// Even worse input:
// '; DROP TABLE users; --
// Query becomes:
// SELECT * FROM users WHERE email = ''; DROP TABLE users; --'
// Your users table is gone


// Defence — parameterized queries, always
// The library handles escaping — your input never touches the query string

// With raw pg:
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [req.body.email]  // passed separately — never concatenated
);

// With Mongoose — automatically safe
const user = await User.findOne({ email: req.body.email });
// Mongoose does not build raw SQL — no injection possible
```

- NoSQL Injection — MongoDB specific
```js
// MongoDB is NOT immune — different injection, same concept

// Attacker sends this as request body:
{
  "email": { "$gt": "" },  // $gt = greater than — matches everything
  "password": { "$gt": "" }
}

// Your vulnerable code:
const user = await User.findOne({
  email: req.body.email,       // { "$gt": "" }
  password: req.body.password  // { "$gt": "" }
});
// This matches the first user in the database — login bypassed

// Defence — validate types strictly before using in queries
const loginSchema = z.object({
  email: z.string().email(),    // must be a string — operators rejected
  password: z.string().min(8),  // must be a string
});

// Or use express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // strips $ and . from req.body, req.params, req.query
```
- Command Injection

```js
// NEVER do this — passing user input to shell commands
const { exec } = require('child_process');
exec(`convert ${req.body.filename} output.pdf`); // dangerous

// Attacker inputs: "file.jpg; rm -rf /"
// Command becomes: convert file.jpg; rm -rf /
// Your server files deleted

// Defence — never use exec with user input
// Use libraries instead of shell commands
const sharp = require('sharp'); // image processing without shell
await sharp(inputBuffer).pdf().toFile('output.pdf');
```

- Mass Assignment Injection
```js
// Your User model has: name, email, password, role
// role should never be settable by user — but:

const user = await User.findByIdAndUpdate(
  req.user.userId,
  req.body,  // directly spreading body — dangerous
  { new: true }
);

// Attacker sends: { "name": "John", "role": "admin" }
// They just made themselves admin

// Defence — whitelist only allowed fields
const allowedFields = { name: req.body.name, email: req.body.email };
// role is never included — even if attacker sends it
const user = await User.findByIdAndUpdate(req.user.userId, allowedFields);
```

## Attack Matrix

| Attack | Root Cause | Fix |
|--------|------------|-----|
| **XSS** (Cross-Site Scripting) | User input rendered as HTML/JavaScript | Sanitize input, escape output, CSP, httpOnly cookies |
| **Clickjacking** | Site loadable in iframe | `X-Frame-Options: DENY`, CSP `frame-ancestors` |
| **MIME Sniffing** | Browser ignores Content-Type | `X-Content-Type-Options: nosniff`, validate file bytes |
| **SQL Injection** | Input concatenated into query | Parameterized queries (always) |
| **NoSQL Injection** | Operators in input reach database | Type validation, `express-mongo-sanitize` |
| **Mass Assignment** | `req.body` spread directly | Whitelist allowed fields explicitly |

---

#### Q: Does Helmet replace authentication?

Ans: It protects `Http/browser` level not the user identity.

### There are three algorithm in rate limit
1. **Fixed window:** Each window has its own counter. 
    - Count requests in a fixed time window
    - Reset counter after window ends

    ❌ Problem:
    User can abuse boundary:
    ```
    100 requests at 2:59
    + 100 requests at 3:00
    = 200 requests in seconds 😬
    ```
2. **Sliding window:** 👉 The window is always moving (sliding) with time.

    At any moment, we only consider requests from the last X seconds

3. **Token bucket:** Token bucket rate limiting works by assigning tokens to a bucket at a fixed refill rate. Each request consumes a token, and if no tokens are available, the request is rejected. It allows controlled bursts while maintaining an average rate over time.

### Real time example of Rate limit with redis and express (falls under Fixed Window)

```js
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = rateLimit

const { RedisStore } = require("rate-limit-redis");
const redis = require("../config/redis");

const ipRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
    keyGenerator: (req) => {
        return `ip: ${ipKeyGenerator(req.ip)}`
    },
    message: 'Too many request from this IP',
    skipSuccessfulRequests: false
})

const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
    keyGenerator: (req) => {
        // For logged-in users,
        if (req.body.email) {
            return `login:${req.body.email}`;
        }
        // For non-logged-in users (e.g., showing a public page), fallback to the safe IP key
        return `login:${ipKeyGenerator(req.ip)}`;
    },
    message: "Too many login request, please try again later",
    skipSuccessfulRequests: true
})

const userRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
    keyGenerator: (req) => {
        if (req && req.user) {
            return `user: ${req.user.id}`
        }
        // fallback for unauthenticated users
        return `user: ${ipKeyGenerator(req.ip)}`
    },
    message: 'Too many requests, please slow down'
})

module.exports = { loginRateLimiter, ipRateLimiter, userRateLimiter }



// config/redis.js
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

module.exports = redis;
```

### Q: What all security measures will you take in Node JS applications

**🔐 1. Authentication & Authorization**
- Use JWT (access + refresh tokens)
- Implement auth middleware to protect routes
- Apply RBAC (role-based access control) where needed

**🔑 2. Password Security**
- Hash passwords using bcrypt
- Never store plain-text passwords

**🛡️ 3. HTTP Security Headers**
- Use Helmet to set secure headers

**🚦 4. Rate Limiting**
- Prevent brute force / DDoS
- Use Redis-based rate limiting

**🧼 5. Input Validation & Sanitization**
- Never trust user input
- Validate and sanitize all inputs (avoid injection attacks)

**🌐 6. HTTPS**
- Always use HTTPS to encrypt data in transit

**🚫 7. Prevent XSS & Injection Attacks**
- Escape user input
- Use proper validation
- Protect against:
    - XSS
    - SQL/NoSQL injection

**🔒 8. Sensitive Data Protection**
- Never expose:
    - passwords
    - tokens
    - internal errors
- Use environment variables for secrets

**🍪 9. Secure Cookies (if used)**

httpOnly, secure, sameSite

**⚠️ 10. Error Handling**
- Don’t expose stack traces in production
- Use centralized error handling

Don’t list randomly. Always group like:

```js
Auth → Data → Input → Network → Attacks
```