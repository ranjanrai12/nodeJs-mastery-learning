## 🚀 Day 18 — Redis + Caching

### What is Redish

Redish stands for REmote DIrectory Server, It store data in memmory in the form of key value.It stores data in `RAM` rather than on disk.

### 🔥 Why Redis?

- **Speed:** Sub-millisecond response times
- **Reduced Database Load:** Fewer expensive queries to your primary database
- **Cost Efficiency:** Less need for database scaling
- **TTL Support:** Built-in expiration for cache entries

### 🧠 Basic Caching Flow

```js
1. Request comes
2. Check Redis
   → if found → return (CACHE HIT)
   → if not → fetch DB (CACHE MISS)
3. Store in Redis
4. Return response
```

`Examples`:
```js
const redis = require("../config/redis")
const asyncHandler = require("../utils/async-handler")

const cacheMiddleware = (duration) => {
    return asyncHandler(async(req, res, next) => {
        const key = `cache:${req.originalUrl}`

        const cacheData = await redis.get(key);
        if(cacheData) {
            // cache hit
            console.log('data sent from redis DB')
            return res.json(JSON.parse(cacheData))
        }

        // cache miss
        const originalJson = res.json;

        // replace with our interceptor, monkey patching
        res.json = function(data) {
            redis.set(key, JSON.stringify(data), 'EX', duration)
            originalJson.call(this, data)
        }
        next()
    })
}

module.exports = cacheMiddleware
```


### Q1: What is Redis?

Redis is an in-memory key-value store used for caching, sessions, and fast data access. It primarily stores data in RAM for high performance, with optional persistence to disk.

### Q2: What is cache hit vs miss?

### Q3: What is cache invalidation?

Cache invalidation is the process of `removing or updating stale data` in the `cache` when the underlying data changes.

### Q4: Where should we NOT use caching?

Avoid caching sensitive data, frequently changing data, or write operations (POST/PUT/PATCH/DELETE). Caching is best suited for read-heavy endpoints.

### Q5: What happens if Redis goes down?

Ans: If the redis goes down Without handling, api will become unavailable.

Approach to handle it

1. **Graceful Fallback (MOST IMPORTANT)**
    ```js
    let cachedData;

    try {
        cachedData = await redis.get(key);
    } catch (err) {
        console.log("Redis down, fallback to DB");
    }

    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }

    // fallback → DB
    const data = await fetchFromDB();
    ```
2. **Circuit Breaker (Advanced)**

    If Redis keeps failing → STOP calling Redis temporarily

    👉 avoids:
    - repeated failures
    - unnecessary latency

3. **Fail-Open vs Fail-Closed**
    **🔓 Fail-Open (Recommended)**

    Redis fails → allow request → hit DB
    👉 used for:
    - user APIs
    - general systems

    **🔒 Fail-Closed**

    Redis fails → reject request

    👉 used for:
    - rate limiting
    - fraud detection
4. **Local Memory Fallback (Optional):** 
    ```
    Redis down → use in-memory cache (short-term)
    ```
    not perfect, but better than nothing

5. **Retry Strategy**
- retry Redis 1–2 times
- don’t block request too long

If Redis goes down, the system should gracefully fall back to the database. However, this may increase DB load and impact performance, so fallback strategies and monitoring are important.

### Q: What is the problem with caching highly dynamic data?

1️⃣ Frequent Cache Invalidation: 
Data changes → cache becomes stale quickly

2️⃣ No Performance Benefit:
Cache miss happens frequently

3️⃣ Stale Data Risk ⚠️:
User sees outdated data

4️⃣ Extra Overhead:
More writes to Redis than reads

Caching highly dynamic data is inefficient because the data changes frequently, leading to constant cache invalidation and reduced cache hit rates. This adds overhead without improving performance and may also result in stale data being served.

**💡 Simple Rule**

```
Cache only if:
Read frequency >> Write frequency
```