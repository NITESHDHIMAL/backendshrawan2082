const mongoose = require('mongoose');

async function mongodbConnect() {
    await mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('Connected!'));
}

module.exports = mongodbConnect;
