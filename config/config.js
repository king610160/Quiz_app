require('dotenv').config()

// need to change back when upload
module.exports = {
    development: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_NAME,
        host: process.env.POSTGRES_HOST,
        dialect: 'postgres',
        port:'5432'
    },
    test: {
        username: process.env.DB_USER_TEST,
        password: process.env.DB_PASSWORD_TEST,
        database: process.env.DB_NAME_TEST,
        host: 'postgres',
        dialect: 'postgres'
    },
    production: {
        username: process.env.DB_USER_PRO,
        password: process.env.DB_PASSWORD_PRO,
        database: process.env.DB_NAME_PRO,
        host: 'postgres',
        dialect: 'postgres'
    }
}
