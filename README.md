# refocus-logging

Common logging service for Refocus and its associated services using
[Apache Kafka](https://kafka.apache.org/). 

"Producer" applications (e.g. Refocus, Refocus Whitelist, Refocus Real-Time,
etc.) publish their log lines as messages to designated
[Topics](https://kafka.apache.org/intro#intro_topics) in the Kafka Cluster.

The Refocus Logging app receives those messages from those topics and logs them
out.

## Installation

Deploy to Heroku.

Provision your Kafka cluster.
  
Define your topics.

Optionally, provision a logging add-on.

## Configuration

You must add environment variables in both the Refocus Logging application and
the "producer" applications.

### Configure the Refocus Logging Application


Configure the following environment variables in the Refocus Logging
application:

- `TOPICS`: Comma-delimited list of topic names.
- `KAFKA_CLIENT_CERT`: File path to the file that contains the client
certificate.
(If you are using Heroku, this is set for you automatically when you provision
your Kafka cluster.)
- `KAFKA_CLIENT_CERT_KEY`: File path to the file that contains the client
certificate key.
(If you are using Heroku, this is set for you automatically when you provision
your Kafka cluster.)
- `KAFKA_URL`: Your Kafka Cluster URL.
(If you are using Heroku, this is set for you automatically when you provision
your Kafka cluster.)
- `KAFKA_CONSUMER_MAX_WAIT_TIME_MS`: Maximum amount of time in milliseconds to
block waiting if insufficient data is available at the time the fetch request
is issued, defaults to 100ms.
- `KAFKA_CONSUMER_MAX_BYTES`:  Maximum size of messages in a fetch response,
defaults to 1MB.
- `KAFKA_CONSUMER_IDLE_TIMEOUT`: Timeout between fetch calls, defaults to
1000ms.

### Configure the Producer Applications

Configure the following environment variables in each of the producer
applications:

- `KAFKA_CLIENT_CERT`: File path to the file that contains the client
certificate.
- `KAFKA_CLIENT_CERT_KEY`: File path to the file that contains the client
certificate key.
- `KAFKA_URL`: Your Kafka Cluster URL.
- `KAFKA_LOGGING`: Set to true to send log lines to the Refocus Logging
application, defaults to false.
- `LOCAL_LOGGING`: Set to false if you want to turn off local logging, defaults
to true.

## Version History

- 1.1.0 Add option for consolidated Refocus logging using Kafka, group consumer
- 1.0.0
