import { client, connectToDatabase } from './Database/postgresConfig';

const createUsersTable = async () => {
    try {
        await connectToDatabase();
        const createQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await client.query(createQuery);
        console.log("Users table created successfully");
    } catch (error) {
        console.error("Error creating to User table:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
};

createUsersTable().then(() => {
    console.log('Database setup completed successfully');
    process.exit(0);
}).catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
});

const insertUsersData = async () => {
    try {
        await connectToDatabase();

        const insertQuery = `
            INSERT INTO users (username, email, password) 
            VALUES ('niteshkushwaha', 'nitesh@gmail.com', 'nitesh@1002')
        `;
        await client.query(insertQuery);
        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error inserting User data:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
};

insertUsersData().then(() => {
    console.log('User data insertion completed successfully');
    process.exit(0);
}).catch((error) => {
    console.error('User data insertion failed:', error);
    process.exit(1);
});

const updateUsersData = async () => {
    try {
        await connectToDatabase();

        const updateQuery = `
            UPDATE users 
            SET password = 'kushwaha' 
            WHERE email = 'karan@gmail.com'
        `;

        const result = await client.query(updateQuery);
        console.log(`Updated ${result.rowCount} user(s) successfully.`);
    } catch (error) {
        console.error("Error updating User data:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
};

updateUsersData().then(() => {
    console.log('User data updation completed successfully');
    process.exit(0);
}).catch((error) => {
    console.error('User data updation failed:', error);
    process.exit(1);
});

const deleteUserData = async () => {
    try {
        await connectToDatabase();

        const deleteQuery = `
            DELETE FROM users  
            WHERE email = 'karan@gmail.com'
        `;

        const result = await client.query(deleteQuery);
        console.log(`Deleted ${result.rowCount} user(s) successfully.`);
    } catch (error) {
        console.error("Error deleting User data:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
}

deleteUserData().then(() => {
    console.log('User data deletion completed successfully');
    process.exit(0);
}).catch((error) => {
    console.error('User data deletion failed:', error);
    process.exit(1);
});