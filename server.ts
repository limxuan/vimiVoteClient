import { parse } from "node:url";
import {
  createServer,
  Server,
  IncomingMessage,
  ServerResponse,
} from "node:http";
import next from "next";
import { WebSocket, WebSocketServer } from "ws";
import { Socket } from "node:net";

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handle = nextApp.getRequestHandler();
const clients: Set<WebSocket> = new Set();

nextApp.prepare().then(() => {
  const server: Server = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const parsedUrl = parse(req.url || "", true);

      if (req.method === "POST" && parsedUrl.pathname === "/api/broadcast") {
        console.log("received post request");
        let body = "";

        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", () => {
          try {
            const message = JSON.parse(body);
            console.log(message);

            // Broadcast to all connected clients
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
                console.log("sent message", JSON.stringify(message));
              }
            });

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", sent: message }));
          } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "error", error: "Invalid JSON" }));
          }
        });

        return;
      }

      // Let Next.js handle all other routes
      handle(req, res, parsedUrl);
    },
  );
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);
    console.log("New client connected");

    ws.on("message", (message: Buffer, isBinary: boolean) => {
      console.log(`Message received: ${message}`);
      clients.forEach((client) => {
        console.log({ readyState: client.readyState });
        if (
          client.readyState === WebSocket.OPEN &&
          message.toString() !== `{"event":"ping"}`
        ) {
          client.send(message, { binary: isBinary });
        }
      });
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log("Client disconnected");
    });
  });

  server.on("upgrade", (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const { pathname } = parse(req.url || "/", true);

    if (pathname === "/_next/webpack-hmr") {
      nextApp.getUpgradeHandler()(req, socket, head);
    }

    if (pathname === "/api/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  server.listen(3000);
  console.log("Server listening on port 3000");
});
