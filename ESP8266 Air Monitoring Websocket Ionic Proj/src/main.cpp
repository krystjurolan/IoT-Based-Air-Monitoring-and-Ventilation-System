#include <Arduino.h>
#include "DHTStable.h"

#include "DHTStable.h"

#include <SocketIoClient.h>

#include <WebSockets.h>

#include <ArduinoJson.h>

// #include <WiFi.h>
// #include <WiFiMulti.h>

#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino

//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>         //https://github.com/tzapu/WiFiManager

DHTStable DHT;

// WiFiMulti WiFiMulti;
SocketIoClient webSocket;


#define DHT11_PIN       5

const int analogInPin = A0;  // ESP8266 Analog Pin ADC0 = A0

const int device_id = 12345;

int sensorValue = 0;  // value read from the pot

const int trigPin = 13;
const int echoPin = 12;
const char *ssid = "GLOBEHINAY";
const char *pass = "12345677";
const char *HOST = "192.168.254.104";

void setup()
{
  Serial.begin(115200);
  Serial.println(__FILE__);
  Serial.print("LIBRARY VERSION: ");
  Serial.println(DHTSTABLE_LIB_VERSION);
  Serial.println();
  Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)");

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT);  // Sets the echoPin as an Input

  // Connect to WIFI
  // WiFiMulti.addAP(ssid, pass);

  WiFiManager wifiManager;

  wifiManager.autoConnect("Hello", "hello123");

  Serial.println("connected...yeey :)");

  // Serial.println("Connecting Wifi...");
  // if (WiFiMulti.run() == WL_CONNECTED)
  // {
  //   Serial.println("");
  //   Serial.println("WiFi connected");
  //   Serial.println("IP address: ");
  //   Serial.println(WiFi.localIP());
  
  // }

  webSocket.begin(HOST, 3001);
}


void loop()
{
    
    int chk = DHT.read11(DHT11_PIN);
  switch (chk)
  {
    case DHTLIB_OK:  
      // Serial.print("OK,\t"); 
      break;
    case DHTLIB_ERROR_CHECKSUM: 
      Serial.print("Checksum error,\t"); 
      break;
    case DHTLIB_ERROR_TIMEOUT: 
      Serial.print("Time out error,\t"); 
      break;
    default: 
      Serial.print("Unknown error,\t"); 
      break;
  }
  // DISPLAY DATA
  // Serial.print(DHT.getHumidity(), 1);
  // Serial.print(",\t");
  // Serial.println(DHT.getTemperature(), 1);

  float humidity = DHT.getHumidity();
  float temp = DHT.getTemperature();

  // Serial.print("temperature: ");
  // Serial.println(temp , 2);
  // Serial.print("\nhumidity: ");
  // Serial.println(humidity , 2);

  //MQ135 part of the code :
  // read the analog in value
  sensorValue = analogRead(analogInPin);

  DynamicJsonDocument json(1024);
  json["device_id"] = device_id;
  json["temperature"] = temp;
  json["humidity"] = humidity;
  json["airQuality"] = sensorValue;

  // print the readings in the Serial Monitor
  // Serial.print("\nsensor = ");
  // Serial.print(sensorValue);
  // Serial.print("\n");

  // int num = sensorValue;
  // char cstr[16];
  // itoa(num, cstr, 10);
  
  char buffer[1024];
  serializeJson(json, buffer);

  webSocket.loop();
  webSocket.emit("distanceInch", buffer);
  
  
  delay(500);
  
}


// -- END OF FILE --