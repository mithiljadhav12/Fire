var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/data', express.static(__dirname + '/data.html'));
//app.use('/transaction', express.static(__dirname + '/book-list.html'));

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});


app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});


app.post("/api/user/", (req, res, next) => {
    var errors = []
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }
    var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params = [data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})



app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : undefined
    }
    db.run(
        `UPDATE user set 
           name = coalesce(?,name), 
           email = COALESCE(?,email), 
           password = coalesce(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data
            })
        });
})


app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", rows: this.changes })
        });
})


app.get("/api/airport", (req, res, next) => {
    var sql = "select * from airport ORDER BY airport_name ASC"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        //console.log("Imma here" + JSON.stringify(rows))
        res.json(JSON.stringify(rows));
        // res.json({
        //     "message": "success",
        //     "data": rows
        // })
    });
});


app.get("/api/aircraft", (req, res, next) => {
    var sql = "select * from aircraft ORDER BY aircraft_no ASC"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        //console.log("Imma here" + JSON.stringify(rows))
        res.json(JSON.stringify(rows));
        // res.json({
        //     "message": "success",
        //     "data": rows
        // })
    });
});


app.get("/api/transaction", (req, res, next) => {
    var sql = "select * from transac ORDER BY transactiondatetime DESC"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        //console.log("Imma here" + JSON.stringify(rows))
        res.json(JSON.stringify(rows));
        // res.json({
        //     "message": "success",
        //     "data": rows
        // })
    });
});

app.get("/api/fuel/transaction", (req, res, next) => {
    var sql = "select * from airport CROSS JOIN transac"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        var total_fuel = 0;
        for (i in rows) {
            if (rows[i].airport_id == '1') {
                if (rows[i].transactiontype == 'IN') {
                    total_fuel += rows[i].fuel_available;
                    console.log(total_fuel)
                }
                else if (rows[i].transactiontype == 'OUT') {
                    total_fuel = total_fuel - rows[i].fuel_available;
                    console.log(total_fuel)
                }
            }
        }

        // console.log(total_fuel)




        //console.log("Imma here" + JSON.stringify(rows))
        res.send(JSON.stringify(rows));
        // res.json({
        //     "message": "success",
        //     "data": rows
        // })
    });
});

app.post("/api/add/transaction", (req, res, next) => {
    var data = {
        //transactionid: req.body.transactionid,
        transactiondatetime: req.body.transactiondatetime,
        transactiontype: req.body.transactiontype,
        airport_id: req.body.airport_id,
        aircraft_id: req.body.aircraft_id,
        quantity: req.body.quantity
    }
    var sql = 'INSERT INTO transac (transactiondatetime, transactiontype,airport_id,aircraft_id,quantity) VALUES (?,?,?,?,?)'
    var params = [data.transactiondatetime, data.transactiontype, data.airport_id, data.aircraft_id, data.quantity]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});


app.patch("/api/reverse/transaction", (req, res, next) => {
    var data = {
        transactiontype: req.body.transactiontype,
        aircraftsid: req.body.aircraftsid
    }
    db.run(
        `UPDATE transac set 
        transactiontype = coalesce(?,transactiontype) 
           WHERE aircraftsid = '1'`,
        [data.transactiontype, req.params.aircraftsid],
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data
            })
        });
});

// Root path
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

