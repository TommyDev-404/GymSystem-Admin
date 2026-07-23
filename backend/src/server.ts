import app from "./app";
import { prisma } from "./lib/prisma";
import http from "http";
import { initSocket } from "./lib/socket";

// ==================== Server Setup ====================

const PORT = 5000;


// Create HTTP server
const server = http.createServer(app);


// Initialize Socket.IO
initSocket(server);


server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║        🏋️ Gym System Backend Server        ║
╠════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}     ║
║  Environment: development                     ║
╚════════════════════════════════════════════╝
  `);
});


// ==================== Graceful Shutdown ====================

const shutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");

  server.close(async () => {
    console.log("✅ HTTP server closed");

    try {
      await prisma.$disconnect();
      console.log("✅ Database disconnected");
    } catch (err) {
      console.error("❌ Error disconnecting DB:", err);
    }

    process.exit(0);
  });
};


// Handle termination signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);


// Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  shutdown();
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  shutdown();
});