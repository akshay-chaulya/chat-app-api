import "dotenv/config";

const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET!;
const nodeEnv = process.env.NODE_ENV || "";

const origin1 = process.env.ORIGIN1;
const origin2 = process.env.ORIGIN2;
const origins = [origin1, origin2]

export { port, jwtSecret, nodeEnv, origins }