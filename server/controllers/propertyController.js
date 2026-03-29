import Property from "../models/Property.js";
import defaultProperties from "../data/defaultProperties.js";

const getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    return res.status(200).json(properties);
  } catch (error) {
    return next(error);
  }
};

const createProperty = async (req, res, next) => {
  try {
    const shouldSeed = req.body?.seed === true;

    if (shouldSeed) {
      const count = await Property.countDocuments();
      if (count > 0) {
        return res.status(200).json({ message: "Seed skipped: properties already exist." });
      }

      const inserted = await Property.insertMany(defaultProperties);
      return res.status(201).json({
        message: "Default properties seeded successfully.",
        count: inserted.length,
      });
    }

    const { title, price, image, location, description } = req.body;

    if (
      !title ||
      price === undefined ||
      price === null ||
      !image ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        message: "title, price, image, location, and description are required.",
      });
    }

    const property = await Property.create({
      title,
      price,
      image,
      location,
      description,
    });

    return res.status(201).json(property);
  } catch (error) {
    return next(error);
  }
};

export { getProperties, createProperty };
