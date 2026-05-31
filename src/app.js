import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

// 2. Parse incoming JSON payloads (Form/API data)
app.use(express.json({ limit: "16kb" }));

// 3. Parse incoming URL-encoded data (URL parameters/queries)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 4. Serve static assets (images, PDFs, favicons) from the "public" folder
app.use(express.static("public"));

// 5. Parse browser cookies securely into req.cookies
app.use(cookieParser());

// routes import

import userRouter from "./routes/user.routes.js"

// routes declaration

app.use("/api/v1/users", userRouter)


export {app}