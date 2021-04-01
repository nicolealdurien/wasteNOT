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
    const emailAsUsername = req.body.emailAsUsername;
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const restaurantName = req.body.restaurantName
    const restaurantStreetAddress = req.body.restaurantStreetAddress
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const phone = req.body.phone
    const website = req.body.website

    models.User.update({
        emailAsUsername: emailAsUsername,           
        firstName: firstName,
        lastName: lastName,
        restaurantName: restaurantName,
        restaurantStreetAddress: restaurantStreetAddress,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        website: website
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
    const itemName = req.body.itemName
    const estimatedQty = parseInt(req.body.estimatedQty)
    const estimatedExpiration = req.body.estimatedExpiration
    const isReadyToEat = req.body.isReadyToEat
    const storageTemp = req.body.storageTemp
    const userId = req.session.user.userId

    let foodDonation = await models.FoodDonation.build({
        itemName: itemName,

        estimatedQty: estimatedQty,
        estimatedExpiration: estimatedExpiration,
        isReadyToEat: isReadyToEat,
        storageTemp: storageTemp,
        userId: userId
    })

    let persistedProduct = await foodDonation.save()
    if(persistedProduct != null) {
        res.render('profile', {message: 'Thank you for your donation! One of our volunteers will arrive shortly to pick it up.'})

    }else {
    res.render('profile', {message: 'Thank you for your donation! One of our volunteers will arrive shortly to pick it up.'})
    }
})

router.get('/past-donations', (req,res)=>{
    console.log(req.session)
    models.FoodDonation.findAll({
        where:{userId: req.session.user.userId}

    }).then((donations)=>{
        res.render('past-donations', {donations:donations})
    }
   
)})

module.exports = router