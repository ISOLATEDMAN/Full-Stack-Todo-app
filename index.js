const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = 3000;
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database is successfully connected....");
    app.listen(PORT, () => {
        console.log("Server is started...");
    });
}).catch((error) => {
    console.error("Error connecting to database:", error.message);
});


const DataSchema = new mongoose.Schema({
    title: String,
});
const Data = mongoose.model('tasks', DataSchema); 


app.post('/', (req, res) => {
    const newData = new Data({
        title: req.body.title,
    });
    newData.save()
        .then(() => res.redirect('/'))
        .catch((error) => {
            console.log("Error saving data:", error);
            res.send("Unable to add data. Please try again.");
        });
});

app.get('/', (req, res) => {
    Data.find()
        .then((data) => {
            res.render('home', { datalist: data }); // Pass fetched data to the template
        })
        .catch((error) => {
            console.log("Error fetching data:", error);
            res.send("Unable to fetch data. Please try again.");
        });
});

app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Data.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        console.log("Error deleting data:", error);
        res.send("Unable to delete data. Please try again.");
    }
});

app.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const updatedTitle = req.body.editedTitle;
    try {
        await Data.findByIdAndUpdate(id, { title: updatedTitle });
        res.redirect('http://localhost:3000');
    } catch (error) {
        console.log("Error updating data:", error);
        res.send("Unable to update data. Please try again.");
    }
});

app.get('/', (req, res) => {
    res.render('home');
});
