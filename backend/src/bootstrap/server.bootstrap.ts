import express from 'express';
import http from 'http';

export class ServerBootstrap {
    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
    }

    initialize() {
        const server = http.createServer(this.app);
        const PORT = Number(process.env.PORT ?? 4000);

        server.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    }
}