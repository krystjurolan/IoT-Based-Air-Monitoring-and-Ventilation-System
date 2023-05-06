const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models');

passport.use(new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) => {
    try {
        // Find user by username
        const user = await db.Users.findOne({ where: { username: username } });

        // console.log(password);
        // const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('The Password in the database: ' + user.password );
        // console.log('The Password passed in the POST request: ' + hashedPassword);

        // If user not found or password is incorrect, return error
        if (!user || !bcrypt.compareSync(password, user.password)) {
            // console.log("-----INVALIIIID-------");
            return done(null, false, { message: 'Invalid username or password' });
        }

        // Return user object if authenticated
        console.log("AUTHENTICATED!!!!!!!!");
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.Users.findByPk(id);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

module.exports = passport;
