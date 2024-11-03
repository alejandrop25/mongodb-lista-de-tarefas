const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = "mongodb+srv://alejandrop2506:JtAyJbbo24EL9nA2@cluster0.trhco.mongodb.net/nome_do_banco?retryWrites=true&w=majority";
        
        await mongoose.connect(uri);
        
        console.log("MongoDB conectado!");
    } catch (error) {
        console.error("Erro na conexão com o MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;