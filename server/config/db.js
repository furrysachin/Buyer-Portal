import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  const hasUsernamePlaceholder = mongoUri.includes("<db_username>");
  const hasPasswordPlaceholder = mongoUri.includes("<db_password>");

  if (hasUsernamePlaceholder || hasPasswordPlaceholder) {
    const missingParts = [
      hasUsernamePlaceholder ? "db_username" : null,
      hasPasswordPlaceholder ? "db_password" : null,
    ]
      .filter(Boolean)
      .join(" and ");

    throw new Error(
      `MONGO_URI has placeholder for ${missingParts}. Replace with real Atlas credentials.`
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    const isAtlasMongo =
      mongoUri.includes("mongodb+srv://") || mongoUri.includes(".mongodb.net");
    const isAuthFailed = /bad auth|authentication failed/i.test(
      error?.message || ""
    );
    const isLocalMongo =
      mongoUri.includes("127.0.0.1") || mongoUri.includes("localhost");
    const isConnRefused =
      error?.code === "ECONNREFUSED" || error?.message?.includes("ECONNREFUSED");

    if (isAtlasMongo && isAuthFailed) {
      console.error(
        "Tip: Atlas credentials were rejected. For local development, use `npm run dev` to start the bundled local MongoDB launcher, or update `server/.env` with a valid Atlas MONGO_URI."
      );
    }

    if (isLocalMongo && isConnRefused) {
      console.error(
        "Tip: local MongoDB is not running. Start it with `powershell -ExecutionPolicy Bypass -File server/scripts/mongoLocal.ps1` (or `cd server && npm run db:local`)."
      );
    }

    process.exit(1);
  }
};

export default connectDB;
