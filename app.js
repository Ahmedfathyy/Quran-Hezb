const express = require('express');
const app = express();
const port = 3000;

const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: '172.17.0.2',
  user: 'root',
  password: '12345678',
  database: 'hezb'
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/request-hezb' , (req, res) => {
    res.render('form');
});


app.post('/request-hezb' , (req, res) => {
    const { name , hezb_num} = req.body;
    connection.query(
        'SELECT MAX(toHezb) AS max_hezb FROM hezb' , (err, results) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } 
            const fromHezb = results[0]['max_hezb'] + 1;
            let toHezb = fromHezb + parseInt(hezb_num) - 1;
            if (fromHezb > 60) {
                return res.send('No more hezb available (شكر الله سعيكم)');
            }
            if (toHezb > 60) {
                toHezb = 60;
            }
            connection.query(
                'INSERT INTO hezb (name, fromHezb, toHezb) VALUES (? , ? , ?)' , [name , fromHezb , toHezb] , (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    res.render('assigned-hezb' , {fromHezb , toHezb});
                }
            );
        }
    );
});

app.get('/view-sheet' , (req, res) => {
    connection.query(
        'SELECT * FROM hezb' , (err, results) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.render('view-sheet' , {
                data: results
            });
        }
    )
});



app.listen(port, () => console.log(`Server started listening on port ${port}!`));

