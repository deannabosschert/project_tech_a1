## Dating site

# Camerades
This is a dating site where photographers and models meet.
They can match on professional grounds.

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
- [x] Make everything so that only the current user can edit/remove its own profile
- [x] Make everything so that only the owner can edit/remove its own moodboard
- [x] Add code comments
- [ ] Update CSS  
- [ ] Loads more
- [ ] Add linter

### Offline weekend to-do
- [ ] New sitemap
- home
- Register
- login
- moodboards
- add moodboard
- moodboard detail
- profile (user detail)
- profiles (of others)
- message detail (socket.io)
- own profile editable
- chat

--> installeer linter
- bugfixes

### When at home:
- [ ] Re-install HeidiSQL/MySQL --> tried to do so with dataroaming in Ardennen but halfway I went through my mb's...


## Example
[screenshot]

<!-- When you first visit the site, you can fill in the form already and see with which persons you've matched. You can view their profile, but to send them a message you'll have to register. -->

So, this website will contain the following pages:
- Home (moodboards + 10 pre-matched users + calendar for the next week?)
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
- ID
- title
- owner (users.id)
- picture of moodboard
- description

--> 'data' is dus hetgeen in de tabel staat; id= id IN moodboards

## Tech

###  Install
`git clone https://github.com/deannabosschert/project_tech_a1.git`  
`cd /project_tech_a1.git`  
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
