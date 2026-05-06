Tomorrow You’ll Learn:

### Password hashing (bcrypt)
### Why plain passwords are dangerous
### Login flow with hashed password
### compare() vs hash()
### secure backend practices

#### Q: Why hashing is important?

Ans: Hashing is important because it ensures that passwords are not stored in plain text. Even if the database is compromised, attackers cannot directly access user passwords, which protects user data and system security.

#### Q: What is salting?
Ans: Salting is the process of adding a random value to a password before hashing it. This ensures that even if two users have the same password, their hashed values will be different.

#### Why can't we decrypt hashed password?

Hashed passwords cannot be decrypted because hashing is a one-way function. Instead of decrypting, we verify passwords by hashing the input again and comparing it with the stored hash.

#### Why bcrypt is preferred?

bcrypt is preferred because it is designed specifically for password hashing. It includes built-in salting and is computationally slow, making brute-force attacks much harder.

#### What happens if we store plain passwords?

If passwords are stored in plain text, anyone with database access can see all user passwords, leading to severe security risks such as account takeover and data breaches.

#### What happens if token is stolen?

If a token is stolen, an attacker can access protected APIs until the token expires. To prevent this, we use short-lived tokens, refresh tokens, HttpOnly cookies, and token rotation. In advanced systems, token blacklisting and HTTPS are also used.


TODO: Need to complete the implementation.
#### Implement Refresh token flow.


TODO: Need to understand
#### Two requests updating same user