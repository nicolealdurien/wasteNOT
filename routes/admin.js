const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const models = require('../models')

const SALT_ROUNDS = 10

// display add-admin page
router.get('/add-admin', (req, res) => {
    res.render('add-admin')
})

// add new admin user
router.post('/add-admin', async (req, res) => {

    const { emailAsUsername, password, firstName, lastName } = req.body

    const salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    let registeredAdmin = await models.Admins.findOne({
        where: {
            emailAsUsername
        }
    })
    if(!registeredAdmin){
       
        let newAdmin = models.Admins.build({
            emailAsUsername,           
            password: hashedPassword,
            firstName, lastName
        })

        let savedAdmin = await newAdmin.save()

        if(savedAdmin != null) {
            res.render('admin-login', { newAdminMessage: 'New admin saved successfully!' })
        } else {
            res.render('add-admin', { message:"Username already exists." })
        }
    } else {
        res.render('add-admin', { message:"Username already exists." })
    }

})

// display admin page to see all donations
router.get('/all-donations', (req, res) => {   
    // res.render('all-donations')
        models.FoodDonation.findAll({
            where: { isDonationComplete: 'false' },
            include:[
                {
                    model: models.User,
                    as: 'user'
                }
            ]
}).then((donations) => {
        res.render('all-donations', { donations: donations })
    })
})


// "delete" a donation
router.post('/delete-donation', (req, res) => {

    const donationId = req.body.donationId

    models.FoodDonation.update({
        isDonationComplete:'true'},
        {
        where: {
            id: donationId
        }
    }).then(deletedFoodDonation => {
        res.redirect('/admin/all-donations')
    })
})

// display add-foodbank page
router.get('/add-foodbank', (req, res) => {
    res.render('add-foodbank')
})

// add a foodbank
router.post('/add-foodbank', async (req, res) => {
    const { name, address, city, state, zip, phone, hours } = req.body
    
    let foodbank = models.Foodbank.build({
        name, address, city, state, zip, phone, hours
    })

    foodbank.save()
    res.render('add-foodbank', { message: 'New food bank location has been saved.' })
})


module.exports = router