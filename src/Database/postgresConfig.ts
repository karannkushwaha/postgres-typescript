import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    connectionString: process.env.POSTGRES_CONNECTION_STRING_URL,
});

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL database");
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw new Error("Failed to connect to PostgreSQL database");
    }
};

export { client, connectToDatabase };
