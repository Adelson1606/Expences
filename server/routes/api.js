const express = require('express')
const router = express.Router()
const moment = require('moment')

const Expense = require('../models/Expense')

router.get('/expenses1/:d1?/:d2?', function (req, res) {
  
})

router.post('/new', function (req, res) {
  let date
  req.body.date ? date = moment(req.body.date).format('LLLL') : date = moment(new Date()).format('LLLL')

  const e = new Expense(
    {
      name: req.body.name, 
      amount: req.body.amount,
      date: date, 
      group: req.body.group 
    })

  e.save()
    .then(function (expenses) {
      res.send(expenses)
    })
    .then(() => {
      const amount = e.amount
      const current = e.name
      console.log(`amount of the expense ${amount}and you spent the money on ${current}`)
    })
})


router.put('/update/:group1/:group2', function (req, res) {
  const group1 = req.params.group1
  const group2 = req.params.group2
  Expense.findOneAndUpdate({ group: group1 }, { group: group2 })
    .then((e) => {
      res.send(`${e.name} group was changet from ${group1} to ${group2}`)
    })
})


router.get('/expenses/:group', function (req, res) {
  const group = req.params.group
  const total = req.query.total
  const d1 = req.query.d1 ? moment(req.query.d1).format('LLLL') : null
  const d2 = req.query.d2 ? moment(req.query.d2).format('LLLL') : null
  const now = moment().format('LLLL')
  
  if (total) {
    Expense.aggregate([
      { $match: { group: group } },
      { $group: { _id: "$group", total: { $sum: "$amount" } } }
    ])
      .then(function (expenses) {
        res.send(expenses)
      })
    return
  }
  //  else {
  //   Expense.find({ group: group })
  //     .then(function (expenses) {
  //       res.send(expenses)
  //     })
  // }


  if (d1 && d2) {
    Expense.find().and([
      { date: { $gt: d1 } },
      { date: { $lt: d2 } }
    ])
      .then((ex) => { 
        res.send(ex) 
      })
  } else if (d1) {
    Expense.find().and([
      { date: { $gt: d1 } },
      { date: { $lt: now } }
    ])
      .then((ex) => { 
        res.send(ex) 
      })
  } else {
    Expense.find({}).sort({ date: -1 })
      .then(function (expenses) {
        res.send(expenses)
      })
  }
})



module.exports = router