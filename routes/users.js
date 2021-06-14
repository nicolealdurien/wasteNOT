const express = require('express')
const router = express.Router()
const models = require('../models')



// display restaurant user profile
router.get('/profile', (req, res) => {
    res.render('profile')
})

router.get('/update-profile/:userId', (req, res) => {

    const userId = parseInt(req.params.userId)

    models.User.findOne({
        where: {
            id: userId
        }
    }).then(users => {
        res.render('update-profile', {users: users})
    })
})

router.post('/update-profile/:userId', (req, res) => {

    const userId = req.params.userId
    const { emailAsUsername, firstName, lastName,
            restaurantName, restaurantStreetAddress, city,
            state, zip, phone, website } = req.body

    models.User.update({
        emailAsUsername, firstName, lastName,
        restaurantName, restaurantStreetAddress, city,
        state, zip, phone, website
    }, {
        where: {
            id: userId
        }
    }).then((updatedUser) => {
        res.redirect('/users/profile')
    })

})

// add new food donation to DB
router.post('/donation', async (req, res) => {
    const estimatedQty = parseInt(req.body.estimatedQty)
    const { itemName, estimatedExpiration, isReadyToEat, storageTemp } = req.body
    const userId = req.session.user.userId

    let foodDonation = await models.FoodDonation.build({
        itemName, estimatedQty, estimatedExpiration,
        isReadyToEat, storageTemp, userId
    })

    let persistedProduct = await foodDonation.save()

    if(persistedProduct != null) {
        res.render('profile', { message: 'Thank you for your donation! One of our volunteers will arrive shortly to pick it up.' })

    } else {
    res.render('profile', { message: 'Thank you for your donation! One of our volunteers will arrive shortly to pick it up.' })
    }
})

router.get('/past-donations', (req,res) => {
    console.log(req.session)
    models.FoodDonation.findAll({
        where: { userId: req.session.user.userId }

    }).then((donations) => {
        res.render('past-donations', { donations:donations })
    }
   
)})

module.exports = router