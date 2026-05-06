## 🚀 Day 12 — JWT Authentication (VERY IMPORTANT)

### what is JWT

JWT (`JSON Web Token`) is a `compact`(It is short, small in size, and easy to send in URLs, HTTP headers, or POST bodies.) and it's a  secure way to transmit information between client and server. It is used for authentication.

**Structure**: It consisit of `three parts`
```
xxxxx.yyyyy.zzzzz
```
1. `Header`: It Contains metadata about the token

```js
{
  "alg": "HS256",  // Signing algorithm
  "typ": "JWT"     // Token type
}
```

2. `Payload`: Contains the claims
```js
{
  "sub": "1234567890",     // Subject (user ID)
  "name": "John Doe",
  "iat": 1516239022,       // Issued at
  "exp": 1516242622,       // Expiration time
  "admin": true
}
```

3. `Signature`: it's a signature, Created by hashing `header + payload` with a secret key.

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```


### How authentication and authorization works in real systems
`Authentication` it means who are you 

`Example:`
- login with email/password
- verify identity

What are you allowed to do

`Example:`

- admin vs normal user
- access control

### Login → token → middleware flow

### Stateless authentication

### Security basics

#### Q: What is stored inside JWT payload?

JWT payload contains claims, which are pieces of information such as userId, roles, or permissions used for authentication and authorization.

#### Q: Where to store token
Tokens can be stored in localStorage, sessionStorage, or cookies. However, for better security (to prevent XSS attacks), HttpOnly cookies are preferred in production.

#### Q: Difference between session-based auth and JWT?

Session-based authentication stores session data on the server, and the client only stores a session ID. JWT-based authentication stores all required information inside the token itself, making it stateless. Sessions require server memory, while JWT scales better in distributed systems.

#### Q: Why JWT is considered stateless?

Since the server does not store user sessions, every request is self-contained and can be handled independently.