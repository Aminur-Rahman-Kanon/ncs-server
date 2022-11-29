const express = require('express');
const mongoose = require('mongoose');
const app = express()
const cors = require('cors');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
const path = require('path');

//import schemas
const mongooseModel = require('./schemas/schema')

app.use(express.json())
app.use(cors())

//connect MongoDB Database
const connectLink = 'mongodb+srv://nihon-chuko-sha:70107437@cluster0.zpwaszs.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectLink, {
    useNewUrlParser: true
}).then(() => console.log('connected to database')).catch(err => console.log(err))

app.post('/uploadCar', async(req, res) => {
    const { models } = req.body;
    console.log(models)
    models.map(item => {
        mongooseModel.uploadModel.create({ model: item })
    })
    res.send('ok');
})

//use Routes
app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const individualUser = await mongooseModel.registerIndividualUser.findOne({email});

    try {
        if (!individualUser) {
            //when individual user not found
            let traderUser = await mongooseModel.registerTraderUser.findOne({ email });
            //when Trader user found
            if (traderUser) {
                if (await bcrypt.compare(password, traderUser.encryptedPassword)){
                    const status = {
                        status: 'ok'
                    }
    
                    const data = {...traderUser._doc, ...status};
                    res.json(data);
                }
                else {
                    res.json({ status: "password doesn't match" })
                }
            }
            else {
                res.json({ status: 'user not found' });
            }
        }
        else {
          if (bcrypt.compare(password, individualUser.password)) {        
            const status = {
                status: 'ok'
            }
    
            const data = {...individualUser._doc, ...status}
            res.json(data)
          }
          else {
            res.json({ status: "password doesn't match" })
          }
        }
        
    } catch (error) {
        res.json({ status: 'network error' })
    }
})

app.post('/signupIndividual', async(req, res) => {
    const { firstName, lastName, country, phoneNumber, email, password } = req.body;    
    let existUserIndividual = await mongooseModel.registerIndividualUser.findOne({ email : email });
    let existUserTrader = await mongooseModel.registerTraderUser.findOne({ email: email});

    if ( existUserIndividual || existUserTrader ) {
        return res.json({ status: 'user exist' })
    }

    const encryptedPassword = await bcrypt.hash(password, salt);

    try {
        await mongooseModel.registerIndividualUser.create({
            firstName,
            lastName,
            email,
            password: encryptedPassword,
            country,
            phone: phoneNumber,
            category: 'individual'
        }).then(response => res.json({ status: 'user registered' })).catch(err => res.json({ status: 'failed' }))

    } catch (error) {
        res.send({status: 'network error'})
    }
})

app.post('/updateUser', async (req, res) => {

    const { category, firstName, lastName, email, country, address, phone, company, website } = req.body;

    console.log(category, firstName, lastName, email, country, address, phone, company, website)

    if (category === 'individual') {
        
        const userExist = await mongooseModel.registerIndividualUser.findOne({ email })

        if (userExist) {
            mongooseModel.registerIndividualUser.updateOne(
                {
                    email
                },
                {
                    $set: { firstName, lastName, country, address, phone, company, website }
                }
            ).then(response => res.json({ status: 'updated' })).catch(err => res.json({ status: 'failed' }))
        }
        else {
            res.json({ status: "user doesn't exist" })
        }
    }
    else if (category === 'trader') {

        const existUser = await mongooseModel.registerTraderUser.findOne({ email });
        
        if (existUser) {
            mongooseModel.registerTraderUser.updateOne(
                {
                    email
                },
                {
                    $set: { userName: `${firstName} ${lastName}`, lastName, country, address, phone, company, website }
                }
            ).then(response => res.json({ status: 'updated' })).catch(err => res.json({ status: 'failed' }))
        }
        else {
            res.json({ status: "user doesn't exist" })
        }
    }
    else if (category === 'guest' || category === 'modified') {
        const existUser = await mongooseModel.registerGoogleUser.findOne({ email });

        if (existUser) {
            mongooseModel.registerGoogleUser.updateOne(
                {
                    email
                },
                {
                    $set:{ category: 'modified', firstName, lastName, country, address, phone, company, website, email }
                }
            ).then(response => res.json({ status: 'updated' })).catch(err => res.json({ status: 'failed' }))
        }
        else {
            mongooseModel.registerGoogleUser.create({
                category: 'modified', firstName, lastName, country, address, phone, company, website, email
            }).then(response => res.json({ status: 'updated' })).catch(err => res.json({ status: 'failed' }))
        }
    }
})

app.post('/signUpTrader', async(req, res) => {
    const {companyName, address, country, phoneNumber, website, email, userName, designation, establishYear, password, aboutCompany} = req.body;

    let firstName = '';
    let lastName = '';

    if (userName.includes(' ')){
        [firstName, lastName] = userName.split(' ');
    }
    else {
        firstName = userName;
    }

    let existUserIndividual = await mongooseModel.registerIndividualUser.findOne({ email: email });
    let existUserTrader = await mongooseModel.registerTraderUser.findOne({ email: email});

    if ( existUserIndividual || existUserTrader ) {
        return res.json({ status: 'user email exist' });
    }

    const encryptedPassword = await bcrypt.hash(password, salt);

    try {
        await mongooseModel.registerTraderUser.create({
            companyName,
            address,
            country,
            phone: phoneNumber,
            website,
            email,
            firstName,
            lastName,
            designation,
            establishYear,
            aboutCompany,
            encryptedPassword,
            category: 'trader'
        }).then(response => res.json({ status: 'user created' })).catch(err => res.json({ status: 'failed' }));

    } catch (error) {
        console.log(error);
        res.json({ status: 'error'})
    }
})

app.post('/contactQuery', async (req, res) => {
    const {name, email, message} = req.body;

    try {
        mongooseModel.contactUserQuery.create({
            name,
            email,
            message
        }).then(response => res.json({ status: 'submitted' })).catch(err => res.json({ status: 'failed' }));

    } catch (error) {
        res.json({status: 'network error'})
    }
})

app.post('/userFeedback', (req, res) => {
    const { satisfy, category, feedBack, name } = req.body;

    try {
        mongooseModel.userFeedbackQuery.create({
            satisfy,
            category,
            feedBack,
            name
        }).then(response => res.json({ status: 'submitted' })).catch(err => res.json({ status: 'failed' }))

    } catch (error) {
        res.json({status: 'network error'})
    }
})


app.get('/requestUserReview', async(req, res) => {
    const request = await mongooseModel.userFeedbackQuery.find()
    console.log('request successfull');
    res.json({data: request})
})

app.post('/submitAuction', async (req, res) => {
    const {make, model, yearFrom, yearTo, budgetFrom, budgetTo, userType, userMsg, title, name, userCountry, port, email, phone, whatsapp, person} = req.body;

    try {
        await mongooseModel.userAuctionInquiry.create({
            make,
            model,
            yearFrom,
            yearTo,
            budgetFrom,
            budgetTo,
            userType,
            userMsg,
            title,
            name,
            userCountry,
            port,
            email,
            phone,
            whatsapp,
            person
        }).then(response => res.json({status: 'submitted'})).catch(err => res.json({status: 'failed'}));
        
    } catch (error) {
        console.log('failed')
        res.json({ status: 'network error'})
    }
})

app.post('/submitParts', async (req, res) => {
    const { make, model, mfgYear, chasisNo, engineModel, condition, shippingMethod, msgType, userMsg, title, userName, country, port, email, phone, whatsapp, person } = req.body;
    
    try {
        await mongooseModel.userPartsInquiry.create({
            make, model, mfgYear, chasisNo, engineModel, condition, shippingMethod, msgType, userMsg, title, userName, country, port, email, phone, whatsapp, person
        }).then(response => res.json({status: 'submitted'})).catch(err => res.json({ status: 'failed' }));

    } catch (error) {
        res.json({ status: 'failed' });
        console.log(error);
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('/client/build'))
    
    app.get('*', (req, res) => {
        res.writeHead(301, { location: 'https://nihonchukosha.onrender.com' })
    })
}

const port = process.env.PORT;
app.listen(port || '8000', () => console.log('server listening on port 8000'))