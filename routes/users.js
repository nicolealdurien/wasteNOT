const express = require('express')
const router = express.Router()

// display restaurant user profile
router.get('/profile', (req, res) => {
    res.render('users/profile')
})

module.exports = router