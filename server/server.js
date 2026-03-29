import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const configuredClientOrigins = (
  process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalDevOrigin = (origin = "") => {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (
        configuredClientOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin))
      ) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "API healthy",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favourites", favouriteRoutes);

app.use(notFound);
app.use(errorHandler);

const preferredPort = Number(process.env.PORT) || 5000;

const isPortAvailable = (port) => {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(false);
        return;
      }

      reject(error);
    });

    tester.once("listening", () => {
      tester.close(() => resolve(true));
    });

    tester.listen(port);
  });
};

const findOpenPort = async (basePort, maxOffset = 20) => {
  for (let offset = 0; offset <= maxOffset; offset += 1) {
    const candidatePort = basePort + offset;
    const available = await isPortAvailable(candidatePort);

    if (available) {
      return candidatePort;
    }
  }

  throw new Error(
    `No open port found in range ${basePort}-${basePort + maxOffset}.`
  );
};

const startServer = async () => {
  try {
    await connectDB();
    const runtimePort = await findOpenPort(preferredPort);

    if (runtimePort !== preferredPort) {
      console.warn(
        `Port ${preferredPort} was in use. Server is running on port ${runtimePort}.`
      );
    }

    const server = app.listen(runtimePort, () => {
      console.log(`Server running on port ${runtimePort}`);
    });

    server.on("error", (error) => {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
