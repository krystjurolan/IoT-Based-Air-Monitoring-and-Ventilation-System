
const { Op, fn, col } = require('sequelize');
const { Data } = require('../models'); // assuming you have a DeviceData model
const sensorController = require('../controllers/sensorDataController');

let esp8266Connections = 0;

module.exports = function(io) {
    // Listen for incoming Socket.io connections
    io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}. Total ESP8266 connections: ${io.engine.clientsCount}`);

    if (socket.handshake.query.deviceType === 'esp8266') {
      esp8266Connections++;
    }

    io.on('disconnect', () => {
        console.log('Socket.io client disconnected');
        if (socket.handshake.query.deviceType === 'esp8266') {
          esp8266Connections--;
        }
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

  //Emits Number of Connections
  setInterval(async () => {
    io.emit('esp8266Connections', io.engine.clientsCount);
  }, 5000)

  //Emits Average Data for each Device_ID
  setInterval(async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // get the average temperature, humidity, and airQuality for each device
    const results = await Data.findAll({
      attributes: [
        'device_id',
        [fn('AVG', col('temperature')), 'avgTemperature'],
        [fn('AVG', col('humidity')), 'avgHumidity'],
        [fn('AVG', col('air_quality')), 'avgAirQuality'],
      ],
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      group: ['device_id'],
    });

    // emit the results to the socket.io clients
    io.emit('averageDataForEveryDevice', results);
    console.log(results);
  }, 5000);

  

  setInterval(async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    Data.findAll({
      attributes: [
        [fn('AVG', col('temperature')), 'avgTemperature'],
        [fn('AVG', col('humidity')), 'avgHumidity'],
        [fn('AVG', col('air_quality')), 'avgAirQuality']
      ],
      where: {
        createdAt: {
          [Op.gte]: startOfDay
        }
      }
    }).then((result) => {
      const data = {
        temperature: result[0].dataValues.avgTemperature.toFixed(2),
        humidity: result[0].dataValues.avgHumidity.toFixed(2),
        airQuality: result[0].dataValues.avgAirQuality.toFixed(2)
      };
      io.emit('averageOfAllData', data);
      console.log("Overall Data Average: " + data);
    }).catch((error) => {
      console.log(error);
    });
  }, 5000);

  //Alerts
  setInterval(async () => {

    const validatedDataForAlert = sensorController.validateDataToAlert();

    let room = validatedDataForAlert.room;
    let temperatureArray = validatedDataForAlert.tempArray;
    let humidityArray = validatedDataForAlert.humidArray;
    let airQualityArray = validatedDataForAlert.airqualArray;

    console.log("-/-/-/-/-/-/-/-/--/-/"+validatedDataForAlert.room);

    function alert(){
      let alert = false;
    
      let temperatureMessage = "";
      let humidityMessage = "";
      let airQualityMessage = "";
    
      if(temperatureArray.length != 0){
    
      /*
      *
      * Temperature Categories(based on ASHRAE Standard)
      * 0 = (*number of degrees) : too cold for occupants and computer components
      * 1 = (*number of degrees) : in normal conditions
      * 2 = (*number of degrees) : normal but uncomfortable for occupants
      * 3 = (*number of degrees) : too hot for occupants and computer components
      * 
      * */
    
        alert = true;
    
        temperatureCategory = temperatureArray[temperatureArray.length - 1];
        humidityCategory = humidityArray[humidityArray.length - 1];
        airQualityCategory = airQualityArray[airQualityArray.length - 1];
        switch(temperatureCategory){
    
          case 0:
            temperatureMessage = "too cold for occupants and computer components";
            break;
          case 2:
            temperatureMessage = "normal but uncomfortable for occupants";
            break;
          case 3:
            temperatureMessage = "too hot for occupants and computer components";
            break;
          default:
            temperatureMessage = "unclassified Temperature measurement"
        }
        
      }
      if(humidityArray.length != 0){
    
      /*
      *
      * Humidity Categories(based on ASHRAE Standard)
      * 0 = (*number of degrees) : too dry for occupants and computer components
      * 1 = (*number of degrees) : in normal conditions
      * 2 = (*number of degrees) : too wet for occupants and computer components
      * 
      * */
    
        alert = true;
    
        humidityCategory = humidityArray[humidityArray.length - 1];
    
        switch(humidityCategory){
          case 0:
            humidityMessage = "too dry for occupants and computer components";
            break;
          case 2:
            humidityMessage = "too wet for occupants and computer components";
            break;
          default:
            humidityMessage = "unclassified Humidity measurement"
        }
      }
      if(airQualityArray.length != 0){
      /*
      *
      * Air Quality Categories(based on ASHRAE Standard)
      * 0 = (*number of degrees) : Air Quality is Good and in normal condition
      * 1 = (*number of degrees) : Air Quality is MODERATE
      * 2 = (*number of degrees) : Air Quality is UNHEALTHY FOR SENSITIVE GROUPS
      * 3 = (*number of degrees) : Air Quality is UNHEALTHY
      * 4 = (*number of degrees) : Air Quality is VERY UNHEALTHY
      * 5 = (*number of degrees) : Air Quality is HAZARDOUS
      * 
      *  https://www.airnow.gov/aqi/aqi-basics/
      * */
    
      alert = true;
    
      airQualityCategory = humidityArray[humidityArray.length - 1];
    
      switch(airQualityCategory){
        case 1:
          airQualityMessage = "Air Quality is MODERATE";
          break;
        case 2:
          airQualityMessage = "Air Quality is UNHEALTHY FOR SENSITIVE GROUPS";
          break;
        case 3:
          airQualityMessage = "Air Quality is UNHEALTHY";
          break;
        case 4:
          airQualityMessage = "Air Quality is VERY UNHEALTHY";
          break;
        case 5:
          airQualityMessage = "Air Quality is HAZARDOUS";
          break;
        default:
          airQualityMessage = "unclassified Air Quality measurement"
      }
    
      }
    
      if(alert){
        console.log("----------------------!!!!!!!!!!!----------------------");
        console.log("\t\t\tALERT");
        console.log("ROOM: " + room.room_name);
        if(temperatureMessage != ""){
          console.log(temperatureMessage);
        }
        if(humidityMessage != ""){
          console.log(humidityMessage);
        }
        if(airQualityMessage != ""){
          console.log(airQualityMessage);
        }
      }
      console.log("----------------------!!!!!!!!!!!----------------------");
    
    }
  }, 10000)

};
