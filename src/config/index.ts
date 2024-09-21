import "dotenv/config";

const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET!;
const nodeEnv = process.env.NODE_ENV || "";

export { port, jwtSecret, nodeEnv }