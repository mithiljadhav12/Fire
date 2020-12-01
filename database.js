var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE transac (
            transactionid INTEGER PRIMARY KEY AUTOINCREMENT,
            transactiondatetime text,
            transactiontype text,
            airport_id INTEGER, 
            aircraft_id INTEGER, 
            quantity INTEGER
            )`, (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO transac (transactiondatetime, transactiontype,airport_id,aircraft_id,quantity) VALUES (?,?,?,?,?)'
                    db.run(insert, ["2Sept", "IN", "1", "01", "02"])
                    db.run(insert, ["1 Dec 2020", "OUT", "1", "1", "1"])
                    db.run(insert, ["1 Dec 2020", "IN", "1", "1", "02"])
                    db.run(insert, ["1 Oct2020", "IN", "4", "4", "32"])
                    db.run(insert, ["1 Oct2020", "IN", "4", "5", "64"])
                }
            })
        // db.run(`CREATE TABLE aircraft (
        //     aircraft_id INTEGER PRIMARY KEY AUTOINCREMENT,
        //     aircraft_no text,
        //     airline text, 
        //     source text, 
        //     destination text
        //     )`, (err) => {
        //         if (err) {
        //             // Table already created
        //         } else {
        //             // Table just created, creating some rows
        //             var insert = 'INSERT INTO aircraft (aircraft_no, airline,source,destination) VALUES (?,?,?,?)'
        //             db.run(insert, ["6E258", "Indigo", "Mumbai", "Delhi"])
        //             db.run(insert, ["SG 3302", "Spice Jet", "Bangalore", "Chennai"])
        //             db.run(insert, ["SG 415", "Go Air", "Mumbai", "Bangalore"])
        //             db.run(insert, ["AI1342", "Air India", "Mumbai", "Chennai"])
        //             db.run(insert, ["9W9893", "Jet Airways", "Delhi", "Banglore"])
        //         }
        //     })
        db.run(`CREATE TABLE airport (
            airport_id INTEGER PRIMARY KEY AUTOINCREMENT,
            airport_name text, 
            fuel_capacity INTEGER, 
            fuel_available INTEGER
            )`, (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO airport (airport_name, fuel_capacity,fuel_available) VALUES (?,?,?)'
                    db.run(insert, ["Indira Gandhi International Airport", "1500", "25066"])
                    db.run(insert, ["Rajiv Gandhi International Airpor", "350723", "320723"])
                    db.run(insert, ["Chhatrapati Shivaji International Airport", "150000", "438467"])
                    db.run(insert, ["Chennai International Airport, Chennai", "15000", "250660"])
                    db.run(insert, ["Kempegowda International Airport, Bangalore", "15000", "123456"])
                }
            })
    }
})


module.exports = db

