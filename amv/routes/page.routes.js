// var passport	    = require('passport');
var bcrypt        = require('bcrypt');
const db          = require('../models');

const { Rooms } = require('../models');


module.exports = (router, passport ,isLoggedIn) => {


  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
  });


    // router.post('/register', async (req, res) => {
    //     // const { username, email, password } = req.body;

    //     console.log(req.body);

    //     const username = req.body.username;
    //     const email = req.body.email;
    //     const password = req.body.password;
      
        // Hash the user's password
      //   const hashedPassword = await bcrypt.hash(password, 12);
      
      //   try {
      //     // Create a new user in the database
      //     const user = await db.Users.create({
      //       username,
      //       email,
      //       password: hashedPassword, // store the hashed password in the database
      //     });
      
      //     // Redirect the user to the login page or display a message indicating that registration was successful
      //     res.redirect('/login');
      //   } catch (error) {
      //     console.error(error);
      //     res.status(500).send('An error occurred while registering. Please try again later.');
      //   }
      // });

      
    router.post('/login', passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
    }));

    
    router.get('/login', async (req, res) => {
      res.render('login');
  });
    

    // // Define login route
    // router.post('/login', passport.authenticate('local', {
    //   successRedirect: '/dashboard',
    //   failureRedirect: '/login',
    //   failureFlash: true
    // }));

    // Define isLoggedIn middleware

    //basic Route
    router.get('/dashboard' , isLoggedIn , async (req, res, next) => {
      // res.render('temp_dashboard', );

      try {
        const rooms = await Rooms.findAll();
        // res.render('rooms', { rooms });
        res.render('temp_dashboard', { rooms });
      } catch (error) {
        console.error(error); //NEEDED TO BE CATCHED CUSTOM-ly
      }

    });

    

}
