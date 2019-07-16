# refocus-logging

Common logging service for Refocus and its associated services.

This project uses [Apache Kafka](https://kafka.apache.org/) to get receive messages and log them. You can
publish your log messages from your app to [Topics](https://kafka.apache.org/intro#intro_topics) in the Kafka Cluster and this app would receive the messages from those topics and log them out. To set up this centralized logging system you need to follow these steps both this logging application and your application from where you want to send the logs (Producer logic).

## Configuration

#### Logging Application
Before launching, this service needs the following environment variables to establish a successful connection:

__process.env.TOPICS__: Topics from the Kafka Cluster that you need to subscribe to.
__process.env.KAFKA_CLIENT_CERT__: File path to the file that contains the client certificate (if you are using Heroku go to the reveal ENV variables options and this should already have a value)
__process.env.KAFKA_CLIENT_CERT_KEY__: File path to the file that contains the client certificate key (if you are using Heroku go to the reveal ENV variables options and this should already have a value)
__process.env.KAFKA_URL__: The URL to where you setup your Kafka Cluster (if you are using Heroku go to the reveal ENV variables options and this should already have a value)
__process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS__: Maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the fetch request is issued, defaults to 100ms
__process.env.KAFKA_CONSUMER_MAX_BYTES__:  Maximum size of messages in a fetch response, defaults to 1MB
__process.env.KAFKA_CONSUMER_IDLE_TIMEOUT__: Timeout between fetch calls, defaults to 1000ms

#### Producer Application

Instead of using the logging library that your app currently uses. Copy paste [this file](https://raw.githubusercontent.com/salesforce/refocus-whitelist/kafka-logging/src/logger.js) and [this file](https://raw.githubusercontent.com/salesforce/refocus-whitelist/kafka-logging/src/kafkaConfig.js) into your project and replace the `require([logging library])` line with `require([path to logger.js])`. 

Similar to the consumer application you need to provide the following env variables to the application. 
__process.env.KAFKA_CLIENT_CERT__: File path to the file that contains the client certificate (if you are using Heroku go to the reveal ENV variables options and this should already have a value)
__process.env.KAFKA_CLIENT_CERT_KEY__: File path to the file that contains the client certificate key (if you are using Heroku go to the reveal ENV variables options and this should already have a value)
__process.env.KAFKA_URL__: The URL to where you setup your Kafka Cluster (if you are using Heroku go to the reveal ENV variables options and this should already have a value)
__process.env.KAFKA_LOGGING__: If this env variable has any non null value, it will establish the Kafka connection
__process.env.LOCAL_LOGGING__: Set this value to false if you want to turn of local logging. Otherwise the default settings sets the local logging to true.

## Installation

Simply deploy to Heroku after adding Sumo Logic and a Kafka Cluster!

## Version History

- 1.0.0
