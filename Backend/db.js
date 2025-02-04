require('dotenv').config();

console.log('#############')
console.log(process.env.DB_USER); // Deve exibir a senha
console.log(process.env.DB_PASSWORD); // Deve exibir a senha
console.log('#############')

module.exports = {
    //uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9nsk1.mongodb.net/rpgGame?retryWrites=true&w=majority`,
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9nsk1.mongodb.net/rpgGame?retryWrites=true&w=majority&appName=Cluster0`

};
