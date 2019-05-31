// source: auth-server- Titus Wormer
// source: https://github.com/cmda-be/course-17-18/tree/master/examples/auth-server
// source: https://github.com/MonikaaS/be-assessment-2/blob/master/index.js

// Require dependencies (import)
var fs = require('fs')
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var mysql = require('mysql')
var bcrypt = require('bcrypt')
var saltRounds = 10
var gate = 8000

require('dotenv').config()

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect()

// Define in what folder the images are dropped
var upload = multer({dest: 'static/image/'})

express()
  .use(express.static('static'))
// Add the body-property for form data
  .use(bodyParser.urlencoded({extended: true}))
// Call session, which makes a middleware-function that ensures that session-data is linked with your request. Sessions are encrypted via .env.
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
// set view-engine to ejs, from now on it'll use the correct renderer (ejs).
  .set('view engine', 'ejs')
// Express looks for those files in the 'view' folder
  .set('views', 'view')
// If you place a get-request on this URL, the following function is called.
  .get('/:id/edit', editForm)
  .get('/', home)
  .get('/log-in', loginForm)
  .get('/log-out', logout)
  .get('/sign-up', signupForm)
  .get('/:id', profile)
  .get('/moodboards', moodboards)
  // When posted to '/', pass on the parameters req and res to 'upload', which passes it to the 'add' function.
  .post('/', upload.single('image'), add)
  .post('/edit/:id', editProfile)
  // .post('/:id', upload.single('image'), editProfile)
  .post('/log-in', login)
// As HTML5 doesn't support a delete-req in its forms yet, this'll work for now.
  .get('/delete/:id', remove)
// If everything above doesn't match, carry out notFound.
  // .use(notFound)
  .listen(gate, function(){
    console.log('This server runs on gate '+gate)
  })


function moodboards(req, res, next){
  connection.query('SELECT * FROM moodboards', done)
  function done(err,data){


  }
  console.log('incoming')
  res.render('moodboards.ejs', {title: title, user:id})

}

function home(req, res, next) {
  connection.query('SELECT * FROM accounts', done)
  function done(err, data) {
    if (err) {
// if there's an error, try to carry out the following middleware.
      next(err)
    }
    else if(!data){next(new Error('Missing some kind of data!'))
    }
    else {
// If everything's alright, respond by rendering list.ejs --> then, the variable names in the template are replaced by the variable values.
      res.render('list.ejs', {data: data, user: req.session.user})
    }
  }
}

function profile(req, res, next) {
// Request the object params as a result of the request, then extract the id from params.
  var id = req.params.id
  connection.query('SELECT * FROM accounts WHERE id = ?', id, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else if (data.length === 0) {
      next()
    } else {
    // Ik definieer user verkeerd. rip.
      res.render('detail.ejs', {data: data[0], session: req.session, user: req.session.user, id: id})
    }
  }
}

function add(req, res, next) {
// Extract everyhing from the body of the request
    var email = req.body.email
    var password = req.body.password
    var min = 8
    var max = 160

    if (!email || !password) {
      return notFound(409, 'Gebruikersnaam of wachtwoord onjuist ingevuld', res)
    }

    if (password.length < min || password.length > max) {
      return notFound(409, 'Password must contain a minimum of ' + min +
      ' and a maximum of ' + max + ' characters', res)
    }

    connection.query('SELECT * FROM accounts WHERE email = ?', email, done)

    function done(err, data) {
      if (err) {
        next(err)
      }
    // Checks if the email is already in use --> checks if there's an empty data-array
      else if (data.length === 0) {
        bcrypt.hash(password, saltRounds, onhash)
      }
      else {
        res.status(409).send('Email already in use')
      }
    }


    function onhash(err, hash) {
      if(err){
        next(err)
      }
      else{
        connection.query('INSERT INTO accounts SET ?', {
        email: email,
        hash: hash,
        email: req.body.email,
        name: req.body.name,
        description: req.body.description,
        sex: req.body.sex,
        age: req.body.age,
        image: req.file
        }, oninsert)
      }

      function oninsert(err, data) {
        if (err) {
          next(err)
        }
        else{
// When the data was inserted into the database, the assigned ID was read out, Called 'id' from now on.
        var id = data.insertId
        if (req.file){
// The file is assigned a custom name (the id it belongs to) and places in the 'static/image'-folder.
          fs.rename(req.file.path, 'static/image/'+data.insertId+'.jpg', (err) => {
            if (err) {
              result.errors.push({id: 500, title: 'Internal Server Error'}, err)
            }
          })
         }
          req.session.user = data
          res.redirect('/' + data.insertId)
        }
      }
    }
}

function remove(req, res, next) {
  var id = req.params.id
// Removing profiles other than yours is not allowed
  if (!req.session.user) {
    res.status(401).send('Credentials required')
    return
  }

  connection.query('DELETE FROM accounts WHERE id = ?', id, done)

  function done(err) {
    if (err) {
      next(err)
    }
    else {
      req.session.destroy()
      res.redirect('/')
    }
  }
}

function signupForm(req, res) {
  res.render('sign-up.ejs')
}

function editForm(req, res){
  res.render('editprofile.ejs')
}

function editProfile(req, res){
  var id = req.session.user.id
  var name = req.body.name
  var email = req.body.email
  var password = req.body.password
  var sex = req.body.sex
  var description = req.body.description
  var age = req.body.age
  var image = req.file

// Editing profiles other than yours is not allowed
  if (!req.session.user) {
    res.status(401).send('Credentials required')
    return
  }
  console.log(req.body)
  bcrypt.hash(password, saltRounds, onhash)
    function onhash(err, hash) {
      if (err) throw err
      connection.query('UPDATE accounts SET ? WHERE id = ?', [{
        email: req.body.email,
        name: req.body.name,
        hash: hash,
        description: req.body.description,
        sex: req.body.sex,
        age: req.body.age,
        image: req.file
      }, id], done)
    }

  function done(err, data) {
    if (err) throw err
    res.redirect('/' + id)
  }
}

function loginForm(req, res) {
  res.render('log-in.ejs')
}

function login(req, res, next) {
  var email = req.body.email
  var password = req.body.password

  if (!email || !password) {
    return res.status(400).send('Email or password are missing')
  }

  connection.query('SELECT * FROM accounts WHERE email = ?', email, done)

  function done(err, data) {
  // Get the data from the first (supposedly: only) user returning from the array
    var user = data && data[0]

    if (err) {
      next(err)
    } else if (user) {
      bcrypt.compare(password, user.hash, onverify)
    } else {
      res.status(401).send('Email does not exist')
    }

    function onverify(err, match) {
    if(err){
      next(err)
    }
    else if (match) {
        req.session.user = user
        res.redirect('/')
      } else {
        res.status(401).send('Password incorrect')
      }
    }
  }
}

function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err)
    } else {
      res.redirect('/')
    }
  })
}

// dit is de laatste errorafhandeling als er verder geen errors zijn gevonden
// function notFound(req, res) {
//   console.log('Errors found,', 404)
//   res.render('not-found.ejs')
// }
