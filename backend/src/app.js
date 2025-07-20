import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

import orgRouter from "./routes/organization.routes.js"
import deptRouter from "./routes/department.routes.js"
import empRouter from "./routes/employee.routes.js"
import companyRouter from "./routes/companyFinancial.routes.js"
import approvalRouter from "./routes/approval.routes.js"
import vendorRouter from "./routes/vendor.routes.js"
import customerRouter from "./routes/customer.routes.js"
import liabilityRouter from "./routes/liability.routes.js"
import assetRouter from "./routes/assets.routes.js"
import transRouter from "./routes/transaction.routes.js"

//http://localhost:8000/api/v1/org/....
app.use("/api/v1/org", orgRouter)
app.use("/api/v1/dept", deptRouter)
app.use("/api/v1/emp", empRouter)
app.use("/api/v1/company", companyRouter)
app.use("/api/v1/approval", approvalRouter)
app.use("/api/v1/vendor", vendorRouter)
app.use("/api/v1/customer", customerRouter)
app.use("/api/v1/use", liabilityRouter)
app.use("/api/v1/asset", assetRouter)
app.use("/api/v1/transaction", transRouter)

export { app }