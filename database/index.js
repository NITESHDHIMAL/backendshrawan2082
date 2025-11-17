const mongoose = require('mongoose');

async function mongodbConnect() {
    await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected")    
}

module.exports = mongodbConnect;
