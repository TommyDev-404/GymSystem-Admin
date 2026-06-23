import app from "./app";
import { env } from "./lib/env";
import { prisma } from "./lib/prisma";


// ==================== Server Setup ====================

const PORT = Number(env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║        🏋️ Gym System Backend Server        ║
╠════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}     ║
║  Environment: ${env.NODE_ENV}                     ║
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