import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Property from "../models/Property.js";
import defaultProperties from "../data/defaultProperties.js";

dotenv.config({ override: true });

const seed = async () => {
  try {
    await connectDB();
    await Property.deleteMany({});
    await Property.insertMany(defaultProperties);
    console.log(`Seeded ${defaultProperties.length} properties.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
