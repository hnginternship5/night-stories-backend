# Nighttime-Stories :heart:
## Basic Setup for the project

1. Clone the project
2. Run 
    ```
        npm
    ```
     install to install all dependencies
3. Create a file in the folder name .env (It will contain your environment variables)
4. In the file set your port and database url. An example is given below
    ```
        DBURI=mongodb://localhost:27017/my-db
        PORT=3000
    ```
5. Ensure MongoDB is installed and running on your machine, so you don't get errors
6. Type in your terminal
    ```bash
    npm run dev
    ```
7. No welcome page yet but you should get some json data in your browser when you load "localhost/:3000(or which ever port you entered in your .env)"


# nodejs-api-template

A starter Template to build Api's with Express Node and MongoDB.

```
1. cp .env.example .env
2. npm i
(Make sure you have mongodb installed)
3. npm run dev
```
## Features

1. Restful Api
2. Swagger Docs
3. Auth with Email Confirmation and Password Recovery
4. Unit and Integration Tests.
5. Modular file configuration and Folder Structure.
6. Es-Lint.
7. Multiple Enviroments setup (development, staging, production)

## Project Structure

```bash
C:.
|   .env
|   .env.example
|   .eslintignore
|   .eslintrc.json
|   .gitignore
|   LICENSE
|   package-lock.json
|   package.json
|   README.md
|
+---src
|   |   app.js
|   |
|   +---config
|   |       .gitkeep
|   |       chalk.js
|   |       development.js
|   |       index.js
|   |       logger.js
|   |       production.js
|   |       staging.js
|   |
|   +---helpers
|   |       index.js
|   |
|   +---models
|   |   |   .gitkeep
|   |   |   index.js
|   |   |
|   |   \---User
|   |           User.js
|   |
|   +---modules
|   |   \---User
|   |       +---controllers
|   |       |       index.js
|   |       |
|   |       +---policies
|   |       |       index.js
|   |       |
|   |       \---routes
|   |               index.js
|   |
|   \---router
|           index.js
|
\---test
    +---integration
    |       .gitkeep
    |
    \---unit
            .gitkeep
```

### SRC FOLDER

This contains most of the folders and  files for the project

### Config Folder

Houses all the config files including enviroment configs for development, staging and production.

### Models Folder

All your mongoose models are kept here and are required automatically into the index.js in the model folder, which in turn is required into the app.js file.

### Test Folder

This contains both folders for integation and unit test files.

### Modules Folder

This contains all the modules for your project, etc User, Admin. In every module folder you have 3 sub-folders:

1. Controllers
2. Policies
3. Routes

#### Controllers

contains all the logic for that specific module.

#### Policies

contains all the validation middleware for that module.

#### Routes

contains module route definitions and assembly point for controllers and validation middleware, assigning them to specific routes.
