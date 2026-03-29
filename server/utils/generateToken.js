import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const userId = user.id || user._id;

  return jwt.sign(
    {
      id: userId,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;
