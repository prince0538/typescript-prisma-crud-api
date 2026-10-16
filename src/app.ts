import express from "express"
import userRoutes from "./routes/auth.route"
import morgan from "morgan"


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/v1/user', userRoutes)

export default app