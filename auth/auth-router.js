const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../users/users-model.js')
const { jwtSecret } = require('../config/secrets.js')

// for /api/auth
router.post('/register', (req, res) => {
   const user = req.body
   const hash = bcrypt.hashSync(user.password, 8)
   user.password = hash

   Users.add(user)
      .then(saved => {
         res.status(201).json(saved)
      })
      .catch(err => {
         res.status(500).json({ message: 'There was an error saving this user to the database', err })
      })
})

router.post('/login', (req, res) => {
   const { username, password } = req.body

   Users.findBy({ username })
      .first()
      .then(user => {
         if (user && bcrypt.compareSync(password, user.password)) {
            const token = createToken(user)

            res.status(200).json({
               message: `Welcome ${user.username}`,
               token
            })
         } else {
            res.status(401).json({ message: 'Invalid Credentials' });
         }
      })
      .catch(err => {
         res.status(500).json({ message: 'There was an error logging in', err });
       });
})

const createToken = (user) => {
   const payload = {
      subject: user.id,
      username: user.username,
      department: user.department,
      role: user.role || 'user'
   }

   const options = {
      expiresIn: '1hr'
   }

   return jwt.sign(payload, jwtSecret, options)
}

module.exports = router