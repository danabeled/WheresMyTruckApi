require('dotenv').config()
module.exports = {
    url : `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
};