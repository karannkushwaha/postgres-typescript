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

// createUsersTable().then(() => {
//     console.log('Database setup completed successfully');
//     process.exit(0);
// }).catch((error) => {
//     console.error('Database setup failed:', error);
//     process.exit(1);
// });

const createUsersAddressTable = async () => {
    let databaseClient;
    try {
        await connectToDatabase();
        databaseClient = client;

        const createQuery = `
            CREATE TABLE addresses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                city VARCHAR(100) NOT NULL,
                country VARCHAR(100) NOT NULL,
                street VARCHAR(255) NOT NULL,
                pincode VARCHAR(20),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        await databaseClient.query(createQuery);
        console.log("Users Address table created successfully");
    } catch (error) {
        console.error("Error creating User Address table:", error);
        throw error;
    } finally {
        if (databaseClient) {
            await databaseClient.end();
            console.log('Disconnected from PostgreSQL database');
        }
    }
};

// createUsersAddressTable().then(() => {
//     console.log('Database setup completed successfully');
//     process.exit(0);
// }).catch((error) => {
//     console.error('Database setup failed:', error);
//     process.exit(1);
// });

const insertUserAddressData = async (user_id: number, city: string, country: string, street: string, pincode: string) => {
    try {
        await connectToDatabase();

        const insertQuery = `
            INSERT INTO addresses (user_id, city, country,street,pincode)
            VALUES ($1, $2, $3,$4,$5)
        `;

        const values = [user_id, city, country, street, pincode];
        await client.query(insertQuery, values);
        console.log("Data inserted successfully.");

    } catch (error) {
        console.error("Error inserting User data:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
}

// insertUserAddressData(2, 'New York', 'USA', '123 Broadway St.', '10001')
//     .then(() => {
//         console.log('User address data insertion completed successfully');
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error('User address data insertion failed:', error);
//         process.exit(1);
//     });

const insertUserData = async (username: string, email: string, password: string) => {

    try {
        await connectToDatabase();

        const insertQuery = `
            INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3)
        `;

        const values = [username, email, password];
        await client.query(insertQuery, values);
        console.log("Data inserted successfully.");

    } catch (error) {
        console.error("Error inserting User data:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
};


// insertUserData('biku', 'biku@gmail.com', 'biku@1002')
//     .then(() => {
//         console.log('User data insertion completed successfully');
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error('User data insertion failed:', error);
//         process.exit(1);
//     });

const updateUsersData = async (password: string, email: string) => {
    try {
        await connectToDatabase();

        const updateQuery = `
            UPDATE users
            SET password = $1
            WHERE email = $2
        `;
        const values = [password, email]

        const result = await client.query(updateQuery, values);
        console.log(`Updated ${result.rowCount} user(s) successfully.`);
    } catch (error) {
        console.error("Error updating User data:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
};

// updateUsersData('biku@2002', 'biku@gmail.com').then(() => {
//     console.log('User data updation completed successfully');
//     process.exit(0);
// }).catch((error) => {
//     console.error('User data updation failed:', error);
//     process.exit(1);
// });

const deleteUserData = async (email: string) => {
    try {
        await connectToDatabase();

        const deleteQuery = `
            DELETE FROM users
            WHERE email = $1
        `;
        const values = [email];

        const result = await client.query(deleteQuery, values);
        console.log(`Deleted ${result.rowCount} user(s) successfully.`);
    } catch (error) {
        console.error("Error deleting User data:", error);
        throw error;
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    }
}

// deleteUserData('ayush@gmail.com').then(() => {
//     console.log('User data deletion completed successfully');
//     process.exit(0);
// }).catch((error) => {
//     console.error('User data deletion failed:', error);
//     process.exit(1);
// });

const retriveUserData = async () => {
    let databaseClient;
    try {
        await connectToDatabase();
        databaseClient = client;

        const selectQuery = `SELECT * FROM users`;

        const result = await databaseClient.query(selectQuery);

        if (result.rows.length > 0) {
            console.log("User found:", result.rows);
            return result.rows;
        } else {
            console.log("No user found");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw error;
    } finally {
        if (databaseClient) {
            await databaseClient.end();
            console.log("Disconnected from PostgreSQL database");
        }
    }
};

// retriveUserData()
//     .then((userData) => {
//         if (userData) {
//             console.log("User data retrieval completed successfully");
//             console.log("Retrieved user:", userData);
//         } else {
//             console.log("No user data retrieved");
//         }
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error("User data retrieval failed:", error);
//         process.exit(1);
//     });

const getUser = async (email: string) => {
    let databaseClient;
    try {
        await connectToDatabase();
        databaseClient = client;

        const selectQuery = `SELECT * FROM users WHERE email=$1`;
        const values = [email]

        const result = await databaseClient.query(selectQuery, values);

        if (result.rows.length > 0) {
            console.log("User found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("No user found");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw error;
    } finally {
        if (databaseClient) {
            await databaseClient.end();
            console.log("Disconnected from PostgreSQL database");
        }
    }
}

// getUser('biku@gmail.com')
//     .then((userData) => {
//         if (userData) {
//             console.log("User data retrieval completed successfully");
//             console.log("Retrieved user:", userData);
//         } else {
//             console.log("No user data retrieved");
//         }
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error("User data retrieval failed:", error);
//         process.exit(1);
//     });

const getUserAddress = async (user_id: Number) => {
    let databaseClient;
    try {
        await connectToDatabase();
        databaseClient = client;

        const selectQuery = `SELECT city, country, street, pincode FROM addresses WHERE user_id=$1`;
        const values = [user_id]

        const result = await databaseClient.query(selectQuery, values);

        if (result.rows.length > 0) {
            console.log("User address found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("No user address found");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user address data:", error);
        throw error;
    } finally {
        if (databaseClient) {
            await databaseClient.end();
            console.log("Disconnected from PostgreSQL database");
        }
    }
}
// getUserAddress(2)
//     .then((userAddress) => {
//         if (userAddress) {
//             console.log("User address retrieval completed successfully");
//             console.log("Retrieved user address:", userAddress);
//         } else {
//             console.log("No user address retrieved");
//         }
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error("User address retrieval failed:", error);
//         process.exit(1);
//     });