import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import { verifyEmployeeJWT } from "./middleware/verifyEmployeeJWT.js"
import { checkServicePermission } from "./middleware/checkServicePermission.js"

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
import deptBudgetRouter from "./routes/departmentBudget.routes.js"
import empRouter from "./routes/employee.routes.js"
import empSalaryRouter from "./routes/employeeSalary.routes.js"
import profileRouter from "./routes/financialProfile.routes.js"
import accountRouter from "./routes/financialAccount.routes.js"
import vendorRouter from "./routes/vendor.routes.js"
import vendorPayRouter from "./routes/vendorPayment.routes.js"
import customerRouter from "./routes/customer.routes.js"
import customerPayRouter from "./routes/customerPayment.routes.js"
import liabilityRouter from "./routes/liability.routes.js"
import approvalRouter from "./routes/approval.routes.js"
import assetRouter from "./routes/assets.routes.js"

//http://localhost:8000/api/v1/org/....
app.use("/api/v1/org", orgRouter)
app.use("/api/v1/dept", verifyEmployeeJWT, checkServicePermission, deptRouter)
app.use("/api/v1/deptBudget", deptBudgetRouter)
app.use("/api/v1/emp", verifyEmployeeJWT, checkServicePermission, empRouter)
app.use("/api/v1/empSalary", empSalaryRouter)
app.use("/api/v1/profile", verifyEmployeeJWT, checkServicePermission, profileRouter)
app.use("/api/v1/account", accountRouter)
app.use("/api/v1/vendor", verifyEmployeeJWT, checkServicePermission, vendorRouter)
app.use("/api/v1/vendorPayment", vendorPayRouter)
app.use("api/v1/customer", verifyEmployeeJWT, checkServicePermission, customerRouter)
app.use("/api/v1/customerPay", customerPayRouter)
app.use("/api/v1/use", liabilityRouter)
app.use("/api/v1/approval", verifyEmployeeJWT, checkServicePermission, approvalRouter)
app.use("/api/v1/asset", verifyEmployeeJWT, checkServicePermission, assetRouter)

export { app }