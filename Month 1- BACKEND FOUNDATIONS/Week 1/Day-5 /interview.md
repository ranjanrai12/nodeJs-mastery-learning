## Day-5 NPM + package.json + dependencies
**Learn:**

* package.json
* package-lock.json
* dependencies vs devDependencies
* semantic versioning

#### 1. What is NPM?
npm (Node Package Manager) is used to install, manage, and version third-party packages in Node.js applications. It also helps run scripts and manage project dependencies.
#### 2. package.json
package.json contains project metadata, dependencies, devDependencies, scripts, version info, main entry file, and configuration required for the project.
#### 3. package-lock.json
package-lock.json ensures deterministic installation by locking the exact versions of dependencies and sub-dependencies so every developer and server gets the same package versions.
#### 4. dependencies vs devDependencies
**dependencies**

Required for the application to run in production

Examples:

express
mongoose

**devDependencies**

Required only during development/build/testing

Examples:

nodemon
eslint
jest

Not exactly “local vs prod”, but:
👉 runtime vs development tools

#### 5. Semantic Versioning
^ = bigger updates
~ = smaller updates

#### 6. Scripts

#### What happens if we delete node_modules folder?
If node_modules is deleted, the project won’t run because installed packages are missing. However, since dependencies are listed in package.json and exact versions in package-lock.json, running npm install recreates it.
#### Difference between:
`^
~`

#### Why should we NOT push node_modules to Git?
repository becomes huge + unnecessary duplication