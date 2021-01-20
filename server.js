const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const dotenv = require('dotenv')

app.set(dotenv.config())

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

MongoClient.connect(process.env.DB_CONNECT, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)
    console.log('Database connected.')

    db = client.db('users')

    app.listen(3000, () => {
        console.log('Server up and running!')
    })
})

app.route('/')
    .get((req, res) => {
        const cursor = db.collection('userInfo').find()
        res.render('index.ejs')
    })
    .post((req, res) => {
        db.collection('userInfo').save(req.body, (err, result) => {
            if (err) return console.log(err)

            console.log('Salvo no Banco de Dados')
            res.redirect('/show')
        })
    })


app.route('/show')
    .get((req, res) => {
        db.collection('userInfo').find().toArray((err, results) => {
            if (err) return res.send(err)
            res.render('show.ejs', { data: results })
        })
    })

app.route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id

        db.collection('userInfo').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('edit.ejs', {data: result})
        })
    })
    .post((req, res) => {
        const id = req.params.id
        const { name, surname, city, state } = req.body

        db.collection('userInfo').updateOne({ _id: ObjectId(id) }, {
            $set: {
                name,
                surname,
                city,
                state
            }
        }, (err, results) => {
            if (err) return res.send(err)

            console.log('Atualizado no banco de dados')
            res.redirect('/show')
        })
    })

app.route('/delete/:id')
    .get((req, res) => {
        const id = req.params.id

        db.collection('userInfo').deleteOne({ _id: ObjectId(id) }, (err, results) => {
            if (err) return res.send(err)
            console.log('Deletado do banco de dados')
            res.redirect('/show')
        })
    })