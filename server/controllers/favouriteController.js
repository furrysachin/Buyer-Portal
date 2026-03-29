import mongoose from "mongoose";
import User from "../models/User.js";
import Property from "../models/Property.js";

const getAuthenticatedUserId = (req) => {
  const userId = req.user?.id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return userId;
};

const getFavourites = async (req, res, next) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user context." });
    }

    const user = await User.findById(userId).populate({
      path: "favourites",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user.favourites);
  } catch (error) {
    return next(error);
  }
};

const addFavourite = async (req, res, next) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user context." });
    }

    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID." });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const existingUser = await User.findById(userId).select("favourites");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const alreadyFavourite = existingUser.favourites.some(
      (favId) => favId.toString() === propertyId
    );

    if (!alreadyFavourite) {
      await User.updateOne(
        { _id: userId },
        { $addToSet: { favourites: propertyId } }
      );
    }

    const user = await User.findById(userId).populate({
      path: "favourites",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: alreadyFavourite ? "Property already in favourites." : "Property added to favourites.",
      favourites: user.favourites,
    });
  } catch (error) {
    return next(error);
  }
};

const removeFavourite = async (req, res, next) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user context." });
    }

    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID." });
    }

    const existingUser = await User.findById(userId).select("favourites");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const wasFavourite = existingUser.favourites.some(
      (favId) => favId.toString() === propertyId
    );

    await User.updateOne(
      { _id: userId },
      { $pull: { favourites: propertyId } }
    );

    const user = await User.findById(userId).populate({
      path: "favourites",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: wasFavourite
        ? "Property removed from favourites."
        : "Property was not in favourites.",
      favourites: user.favourites,
    });
  } catch (error) {
    return next(error);
  }
};

export { getFavourites, addFavourite, removeFavourite };
