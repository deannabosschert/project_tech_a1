// source: auth-server- Titus Wormer
// source: https://github.com/cmda-be/course-17-18/tree/master/examples/auth-server
// source: https://github.com/MonikaaS/be-assessment-2/blob/master/index.js

// Require dependencies (import)
const fs = require('fs')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const multer = require('multer')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const saltRounds = 10
const gate = 8000

require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect()

// Define in what folder the images are dropped
const upload = multer({dest: 'static/image/'})

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
  .get('/moodboards/:id/edit', editMoodboardForm)
  .get('/', home)
  .get('/log-in', loginForm)
  .get('/log-out', logout)
  .get('/sign-up', signupForm)
  .get('/:id', profile)
  .get('/moodboards', moodboard)
  .get('/moodboard-detail', moodboarddetail)
  .get('/add-moodboard', addmoodboard)
  // When posted to '/', pass on the parameters req and res to 'upload', which passes it to the 'add' function.
  .post('/', upload.single('image'), addProfile)
  .post('/add-moodboard', upload.single('static/image/moodboards'), addMoodboard)
  .post('/edit/:id', editProfile)
  .post('/editMoodboard/:id', editMoodboard)
  // .post('/:id', upload.single('image'), editProfile)
  .post('/log-in', login)
// As HTML5 doesn't support a delete-req in its forms yet, this'll work for now.
  .get('/deleteProfile/:id', removeProfile)
  .get('/deleteMoodboard/:id', removeMoodboard)
// If everything above doesn't match, carry out notFound.
  // .use(notFound)
  .listen(gate, function(){
    console.log('This server runs on gate '+gate)
  })


function moodboards(req, res, next){
  connection.query('SELECT * FROM moodboards', done)
  function done(err,data){
    if (err) {
// if there's an error, try to carry out the following middleware.
      next(err)
    }
    else if(!data){next(new Error('Missing some kind of data!'))
    }
    else {
      res.render('moodboards.ejs', {title: title, user:id})
    }
}

function moodboarddetail(req, res, next){
  connection.query('SELECT * FROM moodboards', done)
  function done(err,data){
    if (err) {
// if there's an error, try to carry out the following middleware.
      next(err)
    }
    else if(!data){next(new Error('Missing some kind of data!'))
    }
    else {
      res.render('moodboard-detail.ejs', {data: data[0], id:id})
    }
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
// If everything's alright, respond by rendering list.ejs --> then, the constiable names in the template are replaced by the constiable values.
      res.render('list.ejs', {data: data, user: req.session.user})
    }
  }
}

function profile(req, res, next) {
// Request the object params as a result of the request, then extract the id from params.
  const id = req.params.id
  connection.query('SELECT * FROM accounts WHERE id = ?', id, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else if (data.length === 0) {
      next()
    } else {
    // Ik definieer user verkeerd. rip.
      res.render('profiledetail.ejs', {data: data[0], session: req.session, user: req.session.user, id: id})
    }
  }
}

function addProfile(req, res, next) {
// Extract everyhing from the body of the request
    const email = req.body.email
    const password = req.body.password
    const min = 8
    const max = 160

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
        height: req.body.height,
        work: req.body.work,
        image: req.file
        }, oninsert)
      }

      function oninsert(err, data) {
        if (err) {
          next(err)
        }
        else{
// When the data was inserted into the database, the assigned ID was read out, Called 'id' from now on.
        const id = data.insertId
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

function addMoodboard(req, res, next) {
// Extract everyhing from the body of the request
    connection.query('SELECT * FROM moodboards WHERE title = ?', title, done)

    function done(err, data) {
      if (err) {
        next(err)
      }
    // Checks if the email is already in use --> checks if there's an empty data-array



      else{
        connection.query('INSERT INTO moodboards SET ?', {
        title: title,
        image: req.file,
        description: req.body.description,
        user: req.session.user,
        }, oninsert)
      }

      function oninsert(err, data) {
        if (err) {
          next(err)
        }
        else{
// When the data was inserted into the database, the assigned ID was read out, Called 'id' from now on.
        const id = data.insertId
        if (req.file){
// The file is assigned a custom name (the id it belongs to) and places in the 'static/image'-folder.
          fs.rename(req.file.path, 'static/image/moodboards'+data.insertId+'.jpg', (err) => {
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

function removeProfile(req, res, next) {
  const id = req.params.id
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

function removeMoodboard(req, res, next) {
  const id = req.params.id
// Removing profiles other than yours is not allowed
  if (req.session.user = req.moodboards.user) {
    res.status(401).send('Credentials required')
    return
  }

  connection.query('DELETE FROM moodboards WHERE id = ?', id, done)

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

function add-moodboardForm(req, res) {
  res.render('add-moodboard.ejs')
}

function editForm(req, res){
  res.render('editprofile.ejs')
}



function editProfile(req, res){
  const id = req.session.user.id
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const sex = req.body.sex
  const description = req.body.description
  const age = req.body.age
  const height = req.body.height
  const work = req.body.work
  const image = req.file

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
        image: req.file,
        work: req.work,
        height: req.height
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
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).send('Email or password are missing')
  }

  connection.query('SELECT * FROM accounts WHERE email = ?', email, done)

  function done(err, data) {
  // Get the data from the first (supposedly: only) user returning from the array
    const user = data && data[0]

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
