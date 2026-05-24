## 🔥 Day 19 - System Design + Scaling

### 🧠 Step 1: What is System Design?

Designing how different parts of a system work together to handle scale, performance, and reliability.

### ✅ Q1: Load Balancer

A load balancer distributes incoming requests across multiple servers to prevent any single server from being overloaded. It improves scalability, availability, and fault tolerance. Common strategies include round robin, least connections, and IP hashing.

### ✅ Q2: Stateless Apps

Stateless applications scale better because they don’t store client-specific data on the server. This allows any request to be handled by any server instance, making horizontal scaling easy and enabling better load distribution.

### ✅ Q3: Where system breaks first?

The database is usually the first bottleneck because all read and write operations depend on it. However, depending on the system, other bottlenecks can include network latency, CPU usage, or external services.

### ✅ Q4: Queue

A queue is used to handle high traffic by decoupling request processing. Instead of processing everything synchronously, requests are pushed to a queue and processed asynchronously by workers. This improves scalability and prevents system overload during traffic spikes.

### 🧠 If DB is optimized, what breaks next?

1️⃣ Application Layer (CPU / Thread Pool)
```
Too many requests → Node.js event loop overwhelmed
```
👉 Symptoms:
- slow responses
- timeouts

2️⃣ Network Bottleneck: Too many concurrent connections
- connection limit reached
- latency spikes

3️⃣ External Services
- Payment / Email / 3rd party APIs

4️⃣ Cache Layer (Redis)

High traffic → Redis CPU / memory pressure

5️⃣ Queue System

Queue backlog grows too fast


`If the database is already optimized, the next bottlenecks are typically the application servers, network limits, or external dependencies. High concurrency can overwhelm the event loop, exhaust connections, or cause downstream services to fail.`

### Where should you CONTROL the request?
- App server?
- DB?
- Redis?
- Queue?

Ans: You MUST control requests at the earliest possible point

✅ Best Control Point

🧠 Why Redis?, because Fast (in-memory) + Atomic operations

1. Request comes
2. Redis checks stock
3. If stock > 0 → allow
4. If stock = 0 → reject immediately ❌

```js
const stock = await redis.decr("iphone:stock");

if (stock < 0) {
    return res.status(400).send("Out of stock");
}
```

### 

```
Client
   ↓
Load Balancer
   ↓
App Server
   ↓
Redis (🔥 CONTROL POINT)
   ↓
Queue
   ↓
DB
```


### What if Redis crashes during this flash sale?
Ans: Redis should NOT be a single point of failure

**✅ Solution 1 Redis Cluster / Replication**

- Master + Replica
- Automatic failover

```

Master Redis (down) ❌
↓
Replica becomes new master ✔
```
👉 Tools: Redis Sentinel, Redis Cluster

**✅ Solution 2: Graceful Fallback to DB (Controlled)**

Redis down → fallback to DB (but limited traffic)

✅ Solution 3: Circuit Breaker

✅ Solution 4: Queue Buffering

✅ Solution 5: Fail Fast Strategy (Important)

## IdemPotency

Same request executed multiple times → result should be same

✅ Solution 1: Idempotency Key (BEST PRACTICE)

FLow:
```
1. Client sends unique key (idempotencyKey)
2. Server checks:
   - If key exists → return old response
   - If not → process & store result
```
```js
const key = req.headers["idempotency-key"];

const existing = await redis.get(key);

if (existing) {
   return res.json(JSON.parse(existing)); // return old response
}

// process order
const result = await createOrder();

// store result
await redis.set(key, JSON.stringify(result), "EX", 300);

return res.json(result);
```

✅ Solution 2: Unique Constraint (DB Level): 👉 DB prevents duplicates

✅ Solution 3: Payment Gateway Strategy

🔥 Real System Flow
```
Client
  ↓ (idempotency key)
API
  ↓
Redis (check key)
  ↓
Queue
  ↓
DB
```

userId + productId + status = unique


### ❓ What if request fails halfway?

### ❓ What if:
👉 Payment is successful
👉 But order is NOT created

Ans:
✅ Solution 1: Event-Driven / Queue Retry (Most Common)

```
1. Payment successful
2. Publish event → "payment-success"
3. Order service consumes event
4. Create order
```

✅ Solution 2: Transaction Status Tracking

Store Status:

```
PENDING
PAID
ORDER_CREATED
FAILED
```

✅ Solution 3: Compensation / Refund: 

If order permanently fails: Trigger refund process

🔥 Real Architecture

```
Client
 ↓
Payment Service
 ↓
Queue/Event Bus
 ↓
Order Service

// Temporary failures can retry safely without duplicating payment.
```

### Queue itself goes down?
Ans:
1️⃣ Persistent Queue (Important)
Good queue systems like: `Apache Kafka`, `RabbitMQ` this store messages durably.

`Meaninig = Queue crash ≠ message loss`

✅ 2️⃣ Retry Mechanism:
If consumer/service fails: Retry processing

✅ 3️⃣ Dead Letter Queue (VERY IMPORTANT):

If retries fail repeatedly: Move event → DLQ(Dead Letter Queue)

✅ 4️⃣ Idempotent Consumers: When retry happens:

Do NOT create duplicate order

🔥 Real Architecture

```
Payment Service
   ↓
Persistent Queue
   ↓
Order Service
   ↓
DLQ (if repeated failure)
```

If the queue goes down, the system should rely on durable/persistent messaging so events are not lost. Failed events should be retried automatically, and after repeated failures they should move to a Dead Letter Queue for later processing or investigation. Consumers should also be idempotent to avoid duplicate processing during retries.


### ❓ How will you prevent users from placing multiple orders for the same item?

###     