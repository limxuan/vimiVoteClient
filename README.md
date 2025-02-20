# Sample App: Using web sockets on Next.js

This is a very simple chat application that demonstrates how to web sockets with Next.js. See the video for a walk through of this code: https://youtu.be/9DEvkYB5_A4

## Running locally

First install all dependencies:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

## Deploying to Fly.io

To deploy this application to Fly.io, simply run:

```bash
fly launch
```

When it asks:
```
An existing fly.toml file was found for app ws-demo-next
? Would you like to copy its configuration to the new app?
```

Choose **Yes**.

When it asks:
```
? Do you want to tweak these settings before proceeding?
```

Choose **No** (unless you want to change the app name or region, etc)

Once finished, you'll be able to access your app at `https://<YOUR-APP>.fly.dev`