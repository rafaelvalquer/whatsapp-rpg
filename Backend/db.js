require('dotenv').config();

module.exports = {
    //uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9nsk1.mongodb.net/rpgGame?retryWrites=true&w=majority`,
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9nsk1.mongodb.net/rpgGame?retryWrites=true&w=majority&appName=Cluster0`

};
