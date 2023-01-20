
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const pollController = require('./controller/pollController')

const app = express()

app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/create', pollController.createPollGetController)
app.post('/create', pollController.createPollPostController)

app.get('/polls', pollController.getAllPollsController)

app.get('/polls/:id', pollController.getPoolResultController)
app.post('/polls/:id', pollController.postPoolResultController)

app.get('/', (req, res) => {
    res.render('home')
})



async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb+srv://tarek_mahmud:TAREK420@cluster0.g7gsq.mongodb.net/?retryWrites=true&w=majority')
        .then((res) => {
            app.listen(4000, () => {
                console.log('Mongodb server connected');
            })
        })
        .catch((e) => {
            console.log(e);
        })
}
main()



