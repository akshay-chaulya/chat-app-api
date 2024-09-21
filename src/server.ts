import express from "express";
import { port } from "./config"
import mainRoutes from "./routes"
import { errorHandler } from "./utils";
import { ResponsStatus } from "./types";
import cookieParser from "cookie-parser"

const app = express();

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

app.use("/api/v1", mainRoutes)

// for untracked routes
app.use((_, res) => {
    errorHandler(res, { message: "Page not found", statusCode: ResponsStatus.NotFound })
})

app.listen(port, () => {
    console.log("Server is running on port ", port);
})