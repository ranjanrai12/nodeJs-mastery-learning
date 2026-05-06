## 🚀 Day 9 — Express Router + MVC Structure + Controller Layer

### Understand:

### Express Router deeply
Express Router is used to create modular and maintainable route handling by separating routes into different files instead of writing everything inside app.js.

- users.route.js
- auth.route.js
- product.route.js
and so on..

### Why MVC structure is used
```
Model → DB Layer
Controller → Request handling
View → API response / frontend layer
```
### Route vs Controller vs Service

**Route Layer**
- Defines API endpoints

- Maps each route to a controller function

- **No business logic, no DB calls, no response sending**
```js
// routes/userRoutes.js
router.get('/users/:id', userController.getUserById);
```
**Controller Layer**
 - Receives `req`, `res`
 - Extracts data from request
 - Calls **service** methods
 - **Sends HTTP response** (success/error)
 - Does **not** contain business logic or direct DB queries

```js
// controllers/userController.js
async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
```

**Service Layer**
* Contains business logic
* Calls repositories / ORM / DB
* Returns data (or throws errors)
* **No `req/res` objects**

```js
// services/userService.js
async function getUserById(id) {
  if (!isValidId(id)) throw new Error('Invalid ID');
  const user = await userRepository.findById(id);
  if (!user) throw new Error('User not found');
  return user;
}
```

`Examples`:
```
login user
hash password
generate token
DB queries
```
### Clean backend architecture
* Why fat route files are bad