# node-express-rest-api-example

A Basic Node.js/Express REST API implementation example.

Full Tutorial at https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/

# Usage

* Run `npm install` to installl dependencies
* Run `npm run start` to start the local server
* Load `http://localhost:8000/data` to test the endpoint. It will display a json result to add airport aircraft transaction and show reports.


# API Endpoints


# Add Transaction
http://localhost:8000/api/add/transaction
```json
{
    "message": "success",
    "data": {
        "transactiondatetime": "1 Oct2020",
        "transactiontype": "In",
        "airport_id": "4",
        "aircraft_id": "5",
        "quantity": "1"
    },
    "id": 10
}




# Reverse Transaction

http://localhost:8000/api/reverse/transaction

[{"key":"transactiontype","value":"IN","description":""},{"key":"aircraft_id","value":"2","description":""}]












