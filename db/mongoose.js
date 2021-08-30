'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:admin@csc309-nbeki.mongodb.net/test?retryWrites=true', { useNewUrlParser: true, useCreateIndex: true});

module.exports = {
	mongoose
}
