# Usage

## To start up the API service
```bash
npm install
npm run start
```

## Secret/environment variable required
This environment key should be defined in the `./config/dev.env` file
```.env
ENV=<dev|prod>
JWT_SECRET=<jwt-secret-key>
PORT=<port-no>
MONGODB_URL=<mongodb-connection-uri>

BOT_MAIL=<otp-mail-address>
BOT_MAIL_PASSWORD=<otp-mail-password>
```