import "dotenv/config";
import app from "./app";
import prisma from "./prisma";

const PORT = process.env.PORT || 1234;
async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to database');
    } catch (error: any) {
        console.error('Error connecting to database', error)
    }
    app.listen(PORT, () => {
        console.log(`Server is listening on PORT: ${PORT}`)
    })
}

startServer()