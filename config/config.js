require('dotenv').config()

// need to change back when upload
module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port:'5432'
    },
    test: {
        username: process.env.DB_USER_TEST,
        password: process.env.DB_PASSWORD_TEST,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST_TEST,
        dialect: 'postgres'
    },
    production: {
        username: process.env.DB_USER_PRO,
        password: process.env.DB_PASSWORD_PRO,
        database: process.env.DB_NAME_PRO,
        host: process.env.DB_HOST_PRO,
        dialect: 'postgres'
    }
}
