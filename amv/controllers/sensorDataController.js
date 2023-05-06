// const express = require('express');
// const db = require('../models');
// const Data = db.sensorData;

// const router = express.Router();

// Define an HTTP endpoint to retrieve the data from the database
// router.get('/', async (req, res) => {
//   try {
//     // Retrieve the data from the database using Sequelize
//     const data = await Data.findAll();
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.sendStatus(500);
//   }
// });

const db = require('../models');
const { Op } = require("sequelize");

const controller = {

  handleSensorData: (data) => {
    // console.log('Sensor data recieved: ' + data.sensorID);

  },

  sampleModerateData: (data) => {
    console.log('It should be 10 secs by now - ' + data.temperature);
  },

  moderateData: (data)=>{

    // let secondsCounter = 0;
    // let minuteCounter = 0;

    
    // setInterval( function(){
      
    //   let temperatureData = [];
    //   let humidityData = [];
    //   let airQualityData = [];

    //   secondsCounter++;

    //   if( secondsCounter != 0 ){
    //     let temperature = data.temperature;
    //     let humidity = data.humidity;
    //     let airQuality = data.airQuality;
        
    //     // add the data to the array
    //     // data.push({ temperature, humidity, airQuality });
  
    //     temperatureData.push(temperature);
    //     humidityData.push(humidity);
    //     airQualityData.push(airQuality);
  
    //     console.log('10 SECONDS PASSED! Here are the Data Gathered:');
    //     console.log('temp: ' + temperature + ' ' + 'humid: ' + humidity + ' ' + 'Air Quality: ' + airQuality + ' ');
  
    //     secondsCounter = 0;
    //     minuteCounter++;
    //   }

    //   if( minuteCounter == 6 ){

    //     let avgTemperature = temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length;
    //     let avgHumidity = humidityData.reduce((a, b) => a + b, 0) / humidityData.length;
    //     let avgAirQuality = airQualityData.reduce((a, b) => a + b, 0) / airQualityData.length;
    //     console.log("Average temperature:", avgTemperature);
    //     console.log("Average humidity:", avgHumidity);
    //     console.log("Average air quality:", avgAirQuality);
        
    //     console.log('----1 MINUTE PASSED! Here are the Data Gathered: ------');
    //     console.log('avgtemp: ' + avgTemperature + ' ' + 'avghumid: ' + avgHumidity + ' ' + 'avgAirQuality: ' + avgAirQuality + ' ');
        
    //     let temperatureData = [];
    //     let humidityData = [];
    //     let airQualityData = [];
  
    //     minuteCounter = 0;
  
    //   }

    // }, 10000);

    

   
    
    
    let temperatureData = [];
    let humidityData = [];
    let airQualityData = [];

    let count = 0; // counter to keep track of the number of data points collected

  // function to execute every 10 seconds
  function getData() {

    // get the data from the ESP8266 here
    let temperature = data.temperature;
    let humidity = data.humidity;
    let airQuality = data.airQuality;
    
    // add the data to the array
    // data.push({ temperature, humidity, airQuality });

    temperatureData.push(temperature);
    humidityData.push(humidity);
    airQualityData.push(airQuality);

    console.log('10 SECONDS PASSED! Here are the Data Gathered:');
    console.log('temp: ' + temperature + ' ' + 'humid: ' + humidity + ' ' + 'Air Quality: ' + airQuality + ' ' + 'count: ' + count);
    

    count++;
    
    // if 6 data points have been collected (1 minute of data), calculate the average and reset the array and counter
    if (count == 6) {
      let avgTemperature = temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length;
      let avgHumidity = humidityData.reduce((a, b) => a + b, 0) / humidityData.length;
      let avgAirQuality = airQualityData.reduce((a, b) => a + b, 0) / airQualityData.length;
      console.log("Average temperature:", avgTemperature);
      console.log("Average humidity:", avgHumidity);
      console.log("Average air quality:", avgAirQuality);

      console.log('----1 MINUTE PASSED! Here are the Data Gathered: ------');
      console.log('avgtemp: ' + avgTemperature + ' ' + 'avghumid: ' + avgHumidity + ' ' + 'avgAirQuality: ' + avgAirQuality + ' ');

      let temperatureData = [];
      let humidityData = [];
      let airQualityData = [];
      count = 0;
      
      clearInterval(myInterval);
    }
  }

// execute the function every 10 seconds
const myInterval = setInterval(getData, 10000);


},

  validateTempertaureLevels: (temperature) => {
    /*
    *
    * Temperature Categories(based on ASHRAE Standard)
    * 0 = (*number of degrees) : too cold for occupants and computer components
    * 1 = (*number of degrees) : in normal conditions
    * 2 = (*number of degrees) : normal but uncomfortable for occupants
    * 3 = (*number of degrees) : too hot for occupants and computer components
    * 
    * */

    if (temperature < 20){
      console.log('Temperature is TOO COLD: ' + temperature);
      return 0;
    }
    else if( temperature > 20 && temperature <= 29.99999999 ){
      console.log('Temperature is OK: ' + temperature);
      return 1;
    }
    else if( temperature >= 30 && temperature <= 34.99999999 ){
      console.log('Temperature is NOT COMFORTABLE: ' + temperature);
      return 2;
    }
    else if( temperature >= 35 ){
      console.log('Temperature is TOO HOT: ' + temperature);
      return 3;
    }
  },

  validateHumidityLevels: (humidity) => {
    /*
    *
    * Humidity Categories(based on ASHRAE Standard)
    * 0 = (*number of degrees) : too dry for occupants and computer components
    * 1 = (*number of degrees) : in normal conditions
    * 2 = (*number of degrees) : too wet for occupants and computer components
    * 
    * */
   
    if (humidity < 40){
      console.log('Humidity is TOO DRY: ' + humidity);
      return 0;
    }
    else if( humidity >= 40 && humidity <= 59.99999999 ){
      console.log('Humidity is OK: ' + humidity);
      return 1;
    }
    else if( humidity >= 60 ){
      console.log('Humidity is TOO WET: ' + humidity);
      return 2;
    }
  },

  validateAirQualityLevels: (airQuality) => {
    /*
    *
    * Air Quality Categories(based on ASHRAE Standard)
    * 0 = (*number of degrees) : too dry for occupants and computer components
    * 1 = (*number of degrees) : in normal conditions
    * 2 = (*number of degrees) : too wet for occupants and computer components
    * 
    *  https://www.airnow.gov/aqi/aqi-basics/
    * */
   
    if (airQuality < 50){
      console.log('Air Quality is GOOD: ' + airQuality);
      return 0;
    }
    else if( airQuality >= 50 && airQuality <= 99.99999999 ){
      console.log('Air Quality is MODERATE: ' + airQuality);
      return 1;
    }
    else if( airQuality >= 100 && airQuality <= 149.99999999 ){
      console.log('Air Quality is UNHEALTHY FOR SENSITIVE GROUPS: ' + airQuality);
      return 2;
    }
    else if( airQuality >= 150 && airQuality <= 199.99999999 ){
      console.log('Air Quality is UNHEALTHY: ' + airQuality);
      return 3;
    }
    else if( airQuality >= 200 && airQuality <= 299.99999999 ){
      console.log('Air Quality is VERY UNHEALTHY: ' + airQuality);
      return 4;
    }
    else if( airQuality >= 300 ){
      console.log('Air Quality is HAZARDOUS: ' + airQuality);
      return 5;
    }
  },

  saveData: async (data) => {

      try {
        const room = await db.Rooms.findOne({ where: { device_id: data.device_id } });

        // console.log(room);

        if(room){

          db.Data.create({ 
            RoomId: room.id,
            device_id: data.device_id,
            temperature: data.temperature, 
            humidity: data.humidity, 
            air_quality: data.airQuality, 
            createdAt: new Date() });

        }
        
        console.log("data saved!!!");

        // return room;
      } catch (error) {
        console.error('Error getting room by device ID:', error);
        throw error;
      }

  },

  deleteOldData: async () => {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // set the date to 1 hour ago
      const query = `DELETE FROM Data WHERE createdAt < '${oneHourAgo.toISOString()}'`;
      await db.sequelize.query(query);
      console.log('Old data deleted successfully');
    } catch (error) {
      console.error('Error deleting old data:', error);
    }
  },

  validateDataToAlert: async () => {

    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    const rooms = await db.Rooms.findAll();

    const fiveSecondsAgo = new Date(Date.now() - 5000); // 5 seconds ago
    const data = await db.Data.findAll({
        where: {
          createdAt: {
            [Op.gte]: fiveSecondsAgo,
          }
        }
      });
      console.log(data);

      console.log("_________________________");

}
  
}

module.exports = controller;