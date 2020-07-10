var bodyParser = require('body-parser')
var logger = require('morgan')
var mongoose = require('mongoose')

var express = require('express')
var app = express()

// Use morgan logger for logging requests
app.use(logger('dev'))
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(process.cwd() + '/public'))

var exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/unit18Populater'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected to Mongoose!')
})

var routes = require('./controller/controller.js')
app.use('/', routes)
// set up local port
var PORT = process.env.PORT || 3000

// Start the server
app.listen(PORT, function () {
  console.log('App running on PORT ' + PORT + '!')
})
