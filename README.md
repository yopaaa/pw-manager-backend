# Foobar

Hi this is my project for portofolio,
this app run in nodejs envirotment made with expressJS 

use mongodb for database 

Json Web Token for secure session

Encrypt user password use bcrypt

Docker for packages


## Installation

Use the package manager [npm]() to install dependencies.

```bash
git clone ...

cd pw-manager-backend

npm install
```

## Environment

> in root directory create .env file and write
```js
MAIN_PORT=<YOUR_BACKEND_PORT> // 8080

MONGODB_USER_NAME=<YOUR_MONGODB_USERNAME>

MONGODB_PASSWORD=<YOUR_MONGODB_PASSWORD>

MONGODB_HOST=<YOUR_MONGODB_HOST> // 0.0.0.0:27017

MONGODB_DATABASE=<YOUR_DATABASE_NAME>

NODE_ENV=<YOUR_NODE_ENVIRONMENT> //"production" || "testing"

CORS=<YOUR_FRONTEND_END_POINT> // http://example.com

JWT_SECRET_TOKEN=<YOUR_SECRET_TOKEN> // super-secret

```

## Usage

```bash
# node app.js
npm run start

# nodemon app.js
npm run startDev

# pm2 start app.js
npm run startProd
```

## API

> this example use port 8080

```bash
# create new users
http://localhost:8080/sign/up
# must contain json, data example
# {
#    "name": "John doe",
#    "email": "JohnDoe@gmail.com",
#    "pwd": "secret",
#    "confirmpwd": "secret"
# } 
# return cookies


# login to exist users
http://localhost:8080/sign/in
# must contain json data, example
# {
#    "name": "John doe",
#    "pwd": "secret",
# } 
# return cookies


# to sign out
http://localhost:8080/sign/out
# remove cookies


# to extend sesions
http://localhost:8080/sign/token
# return cookies

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT]()