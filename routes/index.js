const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const models = require('../models')

const SALT_ROUNDS = 10


// display wasteNOT landing page
router.get('/', (req, res) => {
    res.render('index')
})

// display login page
router.get('/login', (req, res) => {
    res.render('login')
})

// display registration page
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', async (req, res) => {

    let emailAsUsername = req.body.emailAsUsername
    let password = req.body.password

    let user = await models.User.findOne( {
        where: {
            emailAsUsername: emailAsUsername
        }
    })
    if (user != null) {
        bcrypt.compare(password, user.password, (error, result) => {

            if(result) {

                //create a session
                if(req.session) {
                    req.session.user = {userId: user.id}
                    res.redirect('/users/profile')
                }
                
            } else {
                console.log('not working')
                res.render('login', {message: 'Incorrect email or password.'})
            }
        })
    } else {
        console.log('not working')
        res.render('login', {message: 'Incorrect email or password.'})
        

    }
})

// add new restaurant user
router.post('/register', async (req, res) => {
    
    const emailAsUsername = req.body.emailAsUsername;
    let password = req.body.password
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

    const salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    let registeredUser = await models.User.findOne({
        where:{
            emailAsUsername: emailAsUsername
        }
    })
    
    if(!registeredUser){
       
    let newUser = models.User.build({
        emailAsUsername: emailAsUsername,           
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        restaurantName: restaurantName,
        restaurantStreetAddress: restaurantStreetAddress,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        website: website
    })

    let savedUser = await newUser.save()

    if(savedUser != null) {
        res.render('login', {newUserMessage: 'New restaurant partner saved successfully!'})
    }else{
        res.render('register',{message:"Username already exists."})
    }

    } else{
        res.render('register',{message:"Username already exists."})
    }
    
})
        
router.get('/logout', (req, res, next) => {

    if(req.session) {
        req.session.destroy((error) => {
            if(error) {
                next(error)
            }else {
                res.redirect('/')
            }
        })
    }
})


// display foodbank "about us page"
router.get('/foodbank', (req, res) => {
    models.User.findAll({})
    .then(users => {
        res.render('foodbank', {users: users})
    })
})

// display foodbank locations page
router.get('/locations', (req, res) => {
    models.Foodbank.findAll({})
    .then(foodbanks => {
        res.render('locations', {foodbanks: foodbanks})
    })
})

router.get('/admin-login', (req,res)=>{
    res.render('admin-login')
})

router.post('/admin-login', async (req, res) => {
console.log("admin login")
    let emailAsUsername = req.body.emailAsUsername
    let password = req.body.password

    let admin = await models.Admins.findOne( {
        where: {
            emailAsUsername: emailAsUsername
        }
    }) 
    console.log(admin)
    if (admin != null) {
        bcrypt.compare(password, admin.password, (error, result) => {

            if(result) {
                console.log("admin authenticated")
                //create a session
                if(req.session) {
                    console.log("session exists")
                    req.session.user = {userId: admin.id}
                    res.redirect('/admin/all-donations')
                }

            } else {
                console.log('not working')
                res.render('admin-login', {message: 'Incorrect email or password.'})
            }
        })
    } else {
        console.log('admin-is-null')
        res.render('admin-login', {message: 'Incorrect email or password.'})
        

    }
})


router.get('/admin-logout', (req, res, next) => {

    if(req.session) {
        req.session.destroy((error) => {
            if(error) {
                next(error)
            }else {
                res.redirect('/admin-login')
            }
        })
    }
})



module.exports = router