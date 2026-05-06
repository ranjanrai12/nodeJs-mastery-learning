## 🚀 DAY 11 - REST API Design + Status Codes + Real Backend Thinking

### REST principles

`REST (Representational State Transfer)` is an architectural style for designing network APIs using standard `HTTP` methods and `stateless communication(no session stored on server)`.

### Proper endpoint design

**RESTful API Key Components**

**Resources (Nouns, NOT verbs)**

```js
// ✅ GOOD - Resources as nouns
/users
/products
/orders/123

// ❌ BAD - Using verbs
/getUsers
/createProduct
/deleteOrder

// Use Proper HTTP Methods
// ❌ BAD
POST /api/deleteUser/123
GET /api/updateUser/123

// ✅ GOOD
DELETE /api/users/123
PUT /api/users/123

// Use Plural Nouns
// ❌ BAD
/user
/order

// ✅ GOOD
/users
/orders
```

### HTTP Methods (Verbs)

# HTTP Methods Overview

| Method   | Purpose                     | Example              | Equivalent Action |
|----------|-----------------------------|----------------------|-------------------|
| GET      | Retrieve data               | `GET /users/123`     | Read              |
| POST     | Create new resource         | `POST /users`        | Create            |
| PUT      | Update entire resource      | `PUT /users/123`     | Replace           |
| PATCH    | Update part of resource     | `PATCH /users/123`   | Update            |
| DELETE   | Remove resource             | `DELETE /users/123`  | Delete            |

### HTTP Status Codes

```js
// Success codes
200 OK - Request successful
201 Created - New resource created
204 No Content - Success, no data to return

// Client error codes
400 Bad Request - Invalid request
401 Unauthorized - Authentication required
403 Forbidden - Authenticated but no permission
404 Not Found - Resource doesn not exist
422 Unprocessable Entity - Validation failed

// Server error codes
500 Internal Server Error - Server problem
502 Bad Gateway - Upstream server error
503 Service Unavailable - Server down/overloaded
```
### Version Your API
```js
// In URL
GET /v1/users
GET /v2/users

// Or in Header (less common)
GET /users
Headers: Accept-Version: v1
```

### Request & response design

```js
// Success response
{
    "success": true,
    "data": { ... },
    "message": "Operation successful"
}

// Error response
{
    "success": false,
    "error": "User not found",
    "statusCode": 404
}
```

### Why should APIs be stateless?

APIs should be stateless because each request should contain all the information needed to process it, without relying on server-side sessions. This improves scalability, reliability, and makes it easier to distribute requests across multiple servers.

TODO: THIS TOPIC IS BIG NEED TO UNDERSTAND 

### Design API for:

👉 Create user

👉 Get all users

👉 Get user by id

👉 Update user

👉 Delete user


### Why should we NOT use verbs in API routes?

We should not use verbs in API routes because REST APIs are designed around resources (nouns), not actions. The HTTP method (GET, POST, PUT, DELETE) already defines the action, so adding verbs in the URL creates redundancy and breaks REST conventions. Using nouns makes APIs more consistent, predictable, and easier to understand.