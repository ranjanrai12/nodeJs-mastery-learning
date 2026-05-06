## DAY 4 - Modules + CommonJS + require/import
**Learn:**

* Why modules are needed
* CommonJS
* require() and module.exports
* module.exports vs exports
* Module caching
* ES Modules (import/export)
* Difference between CommonJS vs ESM


#### Q: Difference between:
`module.exports` and `exports`

Both belong to CommonJS, not ES Modules.

#### What happens if we do this?
```js
exports = {
  add
}
```
instead of 
```js
module.exports = {
  add
}
```
Why

Ans: Both are same, `module.exports = {}` This is the actual object that gets returned from require() and `exports` is just a reference(shortcut) of module.exports.

**Think Like This**
Node internally starts like this:
```js
module.exports = {};
let exports = module.exports;
```
Example:

```js
exports.name = "Ranjan";
exports.age = 28;
// This becomes:
module.exports = {
  name: "Ranjan",
  age: 28
}
// And when imported:
const user = require("./user");
console.log(user);
// output
{
  name: "Ranjan",
  age: 28
}
```

#### Why is require() synchronous?

Ans: `require()` is synchronous because the module must be fully loaded and executed before the importing file can use it. This is acceptable because module loading usually happens during application startup, not during every request.

#### What is module caching and why is it useful?

Ans: Once a module is loaded for the first time, Node stores it in memory (cache). Future require() calls return the cached version instead of reloading and re-executing the module.

#### If a module has:

`console.log("Loaded");`

and 5 different files import it using require(),

How many times will "Loaded" print and why?

Ans: Only once, because Node caches the module after the first `require()`. All later imports return the cached module instead of executing it again.