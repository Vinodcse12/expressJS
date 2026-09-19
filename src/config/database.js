const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://vish060626_db_user:Fzn6JBNRtrnL0V3M@cluster0.zvsib24.mongodb.net/devTender' )  
}

module.exports = connectDB;