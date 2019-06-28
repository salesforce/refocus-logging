cd kafka_2.12-2.3.0

bin/zookeeper-server-start.sh config/zookeeper.properties

bin/kafka-server-start.sh config/server.properties

bin/kafka-topics.sh --zookeeper 127.0.0.1:9092 --create --topic kafka-test-topic --partitions 3 --replication-factor 1
