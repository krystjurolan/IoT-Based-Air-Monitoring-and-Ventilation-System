var express          = require('express'),
   router            = express.Router();
var passport         = require('passport');

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
     console.log(req.user);
     console.log("IS AUTHENTICATED!!!!!!!!  ");
     return next();
   }
   console.log("NOTTTT AUTHENTICATED!!!!!!!!")
   res.redirect('/login');
 }

const userAuth = passport.authenticate('local', { failureRedirect: '/login' });

require('./page.routes')( router, passport , isLoggedIn );
require('./sensor.routes')( router, passport , isLoggedIn);

module.exports = router;