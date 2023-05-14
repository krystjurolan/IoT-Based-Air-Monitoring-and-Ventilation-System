// var passport	    = require('passport');
var bcrypt        = require('bcrypt');
const db          = require('../models');
const { Op } = require("sequelize");
const moment = require('moment');

const { Rooms , Buildings, Data } = require('../models');

const { generateReport } = require('../controllers/reportController');


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
        res.render('dashboard', { rooms });
      } catch (error) {
        console.error(error); //NEEDED TO BE CATCHED CUSTOM-ly
      }

    });

    router.get('/monitoring' , isLoggedIn , async (req, res, next) => {
      // res.render('temp_dashboard', );

      try {
        const rooms = await Rooms.findAll();
        const buildings = await Buildings.findAll();
        
        res.render('monitoring', { rooms , buildings });
      } catch (error) {
        console.error(error); //NEEDED TO BE CATCHED CUSTOM-ly
      }

    });

    router.get('/manage-space' , isLoggedIn , async (req, res, next) => {

      try {
        const rooms = await Rooms.findAll();
        const buildings = await Buildings.findAll();

        res.render('manage_space', { rooms , buildings });
      } catch (error) {
        console.error(error); //NEEDED TO BE CATCHED CUSTOM-ly
      }

    });

    router.post('/manage-space/create-room', isLoggedIn, async (req, res, next) => {
      // res.json(req.body);

      const {device_id , building_id, room_name, room_desc} =  req.body;

      try {
        const room = await Rooms.create({
          device_id,
          BuildingId: building_id,
          room_name,
          room_desc
        });

        res.redirect('/manage-space');
        // res.status(201).json({ success: true, data: room });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    });

    router.post('/manage-space/update-room', isLoggedIn, async (req, res, next) => {
      const roomId = req.body.id;
      const { device_id, building_id, room_name, room_desc } = req.body;

      // res.json(req.body);

      // Update the room in the database
      Rooms.update({
        device_id,
        building_id,
        room_name,
        room_desc
      }, {
        where: { id: roomId }
      })
      .then(() => {
        // Redirect the user back to the original page
        res.redirect('/manage-space');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error updating room');
      });
    } );

    router.post('/manage-space/delete-room', async (req, res) => {
      try {
        // Get the ID of the room to delete from the request params
        const roomId = req.body.id;
    
        // Find the room in the database by its ID
        const room = await Rooms.findByPk(roomId);
    
        // If the room exists, delete it from the database
        if (room) {
          await room.destroy();
          // console.log(`Room with ID ${roomId} was deleted.`);
          // Send a success response to the client
          // res.status(200).send(`Room with ID ${roomId} was deleted.`);
          res.redirect('/manage-space');
        } else {
          // If the room does not exist, send a 404 error to the client
          res.status(404).send(`Room with ID ${roomId} not found.`);
        }
      } catch (error) {
        // If there was an error during the deletion process, send a 500 error to the client
        console.error(`Error deleting room with ID ${roomId}: ${error}`);
        res.status(500).send(`Error deleting room with ID ${roomId}: ${error}`);
      }
    });

    router.post('/manage-space/create-building', isLoggedIn, async (req, res, next) => {
      // res.json(req.body);

      const {building_name, building_desc} =  req.body;

      try {
        const building = await Buildings.create({
          building_name,
          building_desc
        });

        res.redirect('/manage-space');
        // res.status(201).json({ success: true, data: building });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    });

    router.post('/manage-space/update-building', isLoggedIn, async (req, res, next) => {
      const buildingId = req.body.id;
      const { building_name, building_desc } = req.body;

      // res.json(req.body);

      // Update the room in the database
      Buildings.update({
        building_name,
        building_desc
      }, {
        where: { id: buildingId }
      })
      .then(() => {
        // Redirect the user back to the original page
        res.redirect('/manage-space');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error updating room');
      });
      } );

      router.post('/manage-space/delete-building', async (req, res) => {
        try {
          // Get the ID of the room to delete from the request params
          const buildingId = req.body.id;
      
          // Find the room in the database by its ID
          const building = await Buildings.findByPk(buildingId);
      
          // If the room exists, delete it from the database
          if (building) {
            await building.destroy();
            // console.log(`Building with ID ${buildingId} was deleted.`);
            // Send a success response to the client
            // res.status(200).send(`Building with ID ${buildingId} was deleted.`);
            res.redirect('/manage-space');
          } else {
            // If the room does not exist, send a 404 error to the client
            res.status(404).send(`Building with ID ${buildingId} not found.`);
          }
        } catch (error) {
          // If there was an error during the deletion process, send a 500 error to the client
          console.error(`Error deleting Building with ID ${buildingId}: ${error}`);
          res.status(500).send(`Error deleting Building with ID ${buildingId}: ${error}`);
        }
      });

    router.get('/generate-report' , isLoggedIn , async (req, res, next) => {

      try {
        const rooms = await Rooms.findAll();
        const buildings = await Buildings.findAll();

        const oldestData = await db.Data.min('createdAt');
        const newestData = await db.Data.max('createdAt');
        
        res.render('generate_report', { rooms , buildings, oldestData, newestData });
      } catch (error) {
        console.error(error); //NEEDED TO BE CATCHED CUSTOM-ly
      }

    });

    router.post('/generate-report/get-pdf', isLoggedIn, generateReport);

}
