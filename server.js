// Server setup
const express = require('express')
const path = require('path')
const api = require('./server/routes/api')
const bodyParser = require('body-parser')
const app = express()
// const Expense = require('./server/models/Expense')
// const expenses = require('./expenses-data/expenses.json') //[]

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expenses', { useNewUrlParser: true })

app.use('/', api)

// expenses.forEach(e => {
//   const ex = new Expense({ name: e.item, amount: e.amount, date: e.date, group: e.group })
//   ex.save()
// })

const port = 3000
app.listen(port, function () {
  console.log(`Running on port ${port}`)
})
