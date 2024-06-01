require('dotenv').config();

// client config 
const clientConfig = {
    user:process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database:process.env.DB_NAME,
    options:{
        trustServerCertificate: true,
        trustedConnection: false,
        instancename: 'LAPTOP-8SHVUJ6V'
    },
    port:1433
}