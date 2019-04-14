# Where's My Truck API

## Building

Required commands
* npm install

## Testing

### Integration Tests

To run the integration tests that will ensure the Local API and MongoDB are setup properly follow these steps:

* Install [Postman](https://www.getpostman.com/downloads/)
* Open Postman, go to File -> Import... and import the [Where's My Truck Postman test collection](./postman/WheresMyTruck.postman_collection.json)
* [Run the newly imported collection](https://learning.getpostman.com/docs/postman/collection_runs/starting_a_collection_run/)

### Local Functional Testing

To start the server, ensure the .env folder is replaced with the contents of .env.dev