# hyper-socket-authentication

Node.js [Hyper](https://hyper.co) authentication using [socket.io](https://socket.io/) to bind keys to one application instance at a time.

Especially usefull for chrome extensions that can't retrive a hardware ID.

Additionally, it allows selected discord users (owners, admins etc. Configurable list of Discord user IDs in `/middleware/authenticate.js`) to see the amount of active, signed-in users.

## Usage
The file `/client.js` and its contents are for your Node.js application and so can be removed from the rest of the code that is to be hosted on a server.

The default URL to view the number of active users is `https://mydomain.com/active-users`. Like with [hyper-mongo-middleman](https://github.com/essence-daniel/hyper-mongo-middleman), the license key can either be passed as a parameter in the url e.g. `https://mydomain.com/active-users?key=LICENSE_KEY`, or as a header in the form `Authorization: Bearer LICENSE_KEY`

By default, environment variables will be used for the **PORT** `/index.js` and **HYPER_KEY** `/middleware/*.js`, however these values can be hardcoded in their respective files.


## Installation
```bash
git clone https://github.com/essence-daniel/hyper-socket-authentication.git
cd hyper-socket-authentication
```
Delete `/client.js` from the main directory or move it somewhere else for safe keeping (you can always find it again [here](https://github.com/essence-daniel/hyper-socket-authentication/blob/main/client.js)).
```bash
npm install
```
*Optional:* `npm uninstall socket.io-client` (only required for client-side).
## Quick Setup Guide
### Server
1. Update all necessary environment variables.
2. `npm start`.
```bash
listening on port 8080
```
### Client
1. Paste the code from `/client.js` into your node.js application .
2. `npm install socket.io-client`.
3. call `login('ABCD-EFGH-IJKL-MNOP')`
```
Authenticating...
Logged in
```
#### *optional:*
### Browser 
In `/middleware/authenticate.js`, make sure you have copied and added your discord ID to the array of `allowedUsers` otherwise you will see `Unauthorized` when trying to view the active user count.

go to: `https://localhost:8080/active-users?key=ABCD-EFGH-IJKL-MNOP`
```json
{
    "activeUsers": 1
}
```
