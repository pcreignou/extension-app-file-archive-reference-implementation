# Getting started with File Archive Extension App Reference Implementation

This reference implementation models the use case of taking an agreement PDF sent by the DocuSign platform using a file archive extension app, and storing it in the local storage.

# 1. Setup
## 1.1 Clone Repo

```bash
git clone https://github.com/docusign/extension-app-file-archive-reference-implementation.git
```
## 1.2 Setup environment variables for the local repo

- Generate `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE` values using https://randomkeygen.com/ or an alternative of your choice. These values will be used to configure the sample proxy's mock authentication server. The `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` values should match the connection's `clientId` and `clientSecret` values in your app manifest. 
- Copy `template.env` contents to a new file named `development.env`
- Replace `JWT_SECRET_KEY`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `AUTHORIZATION_CODE` in `development.env` with your generated values

## 1.3 Install Node.js and npm

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## 1.4 Install dependencies
```bash
npm install
```

## 1.5 Running the proxy server
Start the proxy server in development mode by running
```bash
npm run dev
```
This will create a local server on port `{development.env.PORT}` that listens for local changes which will trigger a rebuild.

Start the proxy server in production mode by running
```bash
npm run build
npm run start
```
This will start a production build on port `{production.env.PORT}`.


# 2 Setting up ngrok

## 2.1 Install ngrok

https://ngrok.com/docs/getting-started/ 

## 2.2 Start ngrok

Run the following command:

```bash
ngrok http {development.env.PORT}
```

The above will create a public accessible tunnel to your localhost.

For example 
```bash
ngrok                                                    

Send your ngrok traffic logs to Datadog: https://ngrok.com/blog-post/datadog-log

Session Status                online
Account                       email@domain.com (Plan: Free)
Update                        update available (version 3.3.1, Ctrl-U to update)
Version                       3.3.0
Region                        United States (us)
Latency                       60ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://bbd7-12-202-171-35.ngrok-free.app -> http:

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the Forwarding address from the above prompt, you will need this address in your App Manifest. This address is your baseUri for your local routes. 

# 3 Create an extension app

## 3.1 Prepare your app manifest

Replace `<PROXY_BASE_URL>` in this directory's `manifest.json` with your ngrok instance url.

## 3.2 Navigate to https://devconsole-d.docusign.com/

## 3.3 Upload your manifest and create the app
