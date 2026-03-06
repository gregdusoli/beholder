import type { Server, IncomingMessage, ServerResponse } from "http";

export type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;
