
const sensorController = require('../controllers/sensorDataController');

module.exports = function(io) {
    // Listen for incoming Socket.io connections
    io.on('connection', (socket) => {
    console.log('Socket connected: ' + socket.id);

    io.on('disconnect', () => {
        console.log('Socket.io client disconnected');
      });

    // Listen for incoming messages from the Socket.io client
    socket.on('distanceInch', (data) => {
      // Parse the incoming message as JSON
      // const data = JSON.parse(message);

      // console.log(data);

      // sensorController.handleSensorData(data);
      // sensorController.validateTempertaureLevels(data.temperature);
      // sensorController.validateHumidityLevels(data.humidity);
      // sensorController.validateAirQualityLevels(data.airQuality);
      // sensorController.moderateData(data);
      // sensorController.sampleModerateData(data);

      // setInterval(()=>{  
      //     sensorController.saveData(data);
      //     clearTimeout();
      //   }, 10000) 

      sensorController.saveData(data);
      sensorController.deleteOldData();

      
      // let count = 0;

      // setInterval(()=>{
      //   console.log('10 seconds has passed '+ count );
      //   count++;
      //   clearTimeout();
      // }, 10000) 

      // Emit data to client-side JavaScript
      io.emit('data', data);  
  
      // try {
      //   // Save the received data to the database using Sequelize
      //   await Data.create({
      //     sensorId: data.sensorId,
      //     temperature: data.temperature,
      //     humidity: data.humidity,
      //   });
      //   console.log('Data saved to database');
      // } catch (err) {
      //   console.error(err);
      // }
    });
  });
};
