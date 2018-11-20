const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const app = express();

// body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//db config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose
    .connect(db)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

//passport middleware
app.use(passport.initialize());

//passport conf
require('./config/passport')(passport);

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


//Server static assets
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));