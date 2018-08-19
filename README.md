# Smart Home Panel

This repository contains the source code for my latest hobby project: The Smart Home panel.
The repo is divided into two JavaScript projects: `smart-home-panel-client` and `smart-home-panel-server`.

*TODO: Description*

## Client

Front-end application spawned from the default `create-react-app` template.

### Running the app

```
cd client
npm i
npm start
```
The client application runs on port 3000 by default. You can run the app in a different port by launching the app like this: `PORT=<PORT_NUMBER> npm start`
All fetch-requests are proxied to `localhost:3001` by default. You can change this behavior by modifying the proxy-attribute in package.json

### Mock JSON server

A mock `json-server` can be used instead by running `npm run mock-api`. The contents of `test/mock/db.json` will be served on `http://localhost:3001`

## Server

Back-end API built on top of express

### Database server

The server requires a running MongoDB server to function. A `docker-compose.yml` is provided to set it up. Also mongo-express server will be launched and can be accessed from `http://localhost:8081`

### Registering gateways

You can discover gateways or create authentication keys with the `bin/tradfri` utility.

Currently the backend application expects the Mongo database to contain a collection named `gateways` which contain documents describing the gateways to connec to.
Example gateway document:

```
{
    "_id": ObjectID("5a64b49311b745014492be27"),
    "_type": "tradfri",
    "name": "Trådfri Gateway",
    "hostname": "192.168.0.9",
    "auth": {
        "identity": "XXXXXX",
        "psk": "XXXXXXX"
    },
    "__v": 0
}
```

The `auth` property contains the identity and pre shared key generated with the `bin/tradfri` utility.

### Running the server

```
cd server
npm i
npm start
```
The server runs on port 3001 by default. You can run the app in a different port by launching the server like this: `PORT=<PORT_NUMBER> npm start`
