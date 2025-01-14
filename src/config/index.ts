import "dotenv/config";

const port: number = parseInt(process.env.PORT || "5000", 10);
const jwtSecret: string = process.env.JWT_SECRET as string;
const nodeEnv: string = process.env.NODE_ENV || "";

const origin1: string = process.env.ORIGIN1 as string;
const origin2: string = process.env.ORIGIN2 as string;
const origins: string[] = [origin1, origin2];

export { port, jwtSecret, nodeEnv, origins };
