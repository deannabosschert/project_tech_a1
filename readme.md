## Dating site

# Camerades
This is a dating site where photographers and models meet.
They can match on professional grounds, or with romantic interest aswell.

They can match through moodboards of shoots to work on, through availability or through personal interests.

## To Do
- [x] Repository, clone, readme
- [x] Add basic concept into readme  
- [x] Add basic server  
- [ ] Add basic HTML + CSS  
- [x] Add SQL  
- [ ] Set up first (test)database-tables  
- [ ] Fill database  
- [ ] Make current routes work  
- [ ] Make 'edit' work  
- [x] Make 'remove' work  
- [x] Make everything so that only the current user can edit its own profile
- [x] Add code comments
- [ ] Update CSS  
- [ ] Loads more

## Example
[screenshot]


## Description
This is a dating site

<!-- When you first visit the site, you can fill in the form already and see with which persons you've matched. You can view their profile, but to send them a message you'll have to register. -->

So, this website will contain the following pages:
- Home (moodboards + 10 pre-matched users + calender for the next week?)
- Login
- Register
- Profile (portfolio + moodboards)
- Profile (edit)
- User detail (general info + portfolio + moodboards)
- User chat
- Chat overview
- Moodboards overview
- Matching screen with filter options (user in control)
- Matches overview
- Calender for availability

Happy flow: Login-form-register-profileOfCurrentUser-home-moodboards-userDetail-chat

### Data
So far I'll be using two relational tables with data:

**Account**

| ID | email | name | description | hash | sex | image |
|----|-------|------|-------------|------|-----|-------|
|    |       |      |             |      |     |       |
|    |       |      |             |      |     |       |
|    |       |      |             |      |     |       |

**Moodboards**


## Tech

###  Install
`git clone https://github.com/deannabosschert/be-assessment-2.git`  
`cd /be-assessment-2.git`  
`npm install`  

### Packages
This is where I'll document the packages I've used:
* bcrypt: "^1.0.3"  
* body-parser: "^1.18.2"  
* dotenv: "^5.0.1"  
* ejs: "^2.5.7"  
* express: "^4.16.2"  
* express-session: "^1.15.6"  
* fs: "0.0.1-security"  
* gyp: "^0.5.0"  
* multer: "^1.3.0"  
* mysql: "^2.15.0"  
* node-gyp: "^3.6.2"  
* rebuild: "^0.1.2"  
* sql: "^0.78.0"  

### Database
For this project I'll use a SQL-database to store the data and will make use of HeidiSQL to still keep my data local and visible.

### Login SQL
service mysql start
`mysql -u your-username -p`  
(then, enter the password)

### .env file
Add the SQL info:
```
DB_HOST=localhost
DB_USER=myusername
DB_NAME=mydatabase
DB_PASSWORD=mypassword
```

### Start
`npm start`


## License
[MIT][] © [Deanna Bosschert][author]
[mit]: /license
[author]: deanna.nl


## Acknowledgments/inspiration sources
https://github.com/cmda-be/course-17-18/tree/master/examples/mysql-server  
https://github.com/cmda-be/course-17-18/tree/master/examples/auth-server  
https://github.com/MonikaaS/be-assessment-2/blob/master/index.js  
https://github.com/timruiterkamp/be-assessment-2/blob/master/index.js  
https://github.com/FJvdPol/shelter
https://github.com/maanlamp
