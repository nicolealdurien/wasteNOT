const express = require('express')
const router = express.Router()
const models = require('../models')



// display restaurant user profile
router.get('/profile', (req, res) => {
    res.render('profile')
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