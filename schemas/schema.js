const mongoose = require('mongoose');

const registerIndividual = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: {type: String, unique: true},
        country: String,
        address: String,
        phone: String,
        company: String,
        website: String,
        password: String,
        adPosted: Number,
        carSold: Number,
        activeAd: Number,
        category: String
    },
    {
        collection: 'registerIndividual'
    }
)

const registerTrader = new mongoose.Schema(
    {
        companyName: {type: String, required: true},
        address: {type: String, required: true},
        country: {type: String, required: true},
        phone: {type: String, required: true},
        website: String,
        email: {type: String, unique: true, required: true},
        firstName: {type: String, required: true},
        lastName: String,
        designation: String,
        establishYear: String,
        aboutCompnay: String,
        encryptedPassword: {type: String, required: true},
        category: String
    },
    {
        collection: 'registerTrader'
    }
)

const registerGoogle = new mongoose.Schema(
    {
        category: String,
        firstName: String,
        lastName: String,
        email: String,
        country: String,
        address: String,
        phone: String,
        company: String,
        website: String
    },
    {
        collection: 'registerGoogle'
    }
)

const contactQuery = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        message: {type: String, required: true}
    },
    {
        collection : 'contactQuery'
    }
)

const userFeedback = new mongoose.Schema(
    {
        satisfy: Number,
        category: String,
        feedBack: String,
        name: String
    },
    {
        collection: 'userFeedback'
    }
)

const auctionInquiry = new mongoose.Schema(
    {
        make: { type: String, required: true },
        model: { type: String, required: true },
        yearFrom: { type: Number, required: true },
        yearTo: { type: Number, required: true },
        budgetFrom: { type: Number, required: true },
        budgetTo: { type: Number, required: true },
        userType: { type: Array, required: true },
        userMsg: { type: String, required: true },
        title: String,
        name: { type: String, required: true },
        userCountry: { type: String, required: true },
        port: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
        whatsapp: String,
        person: { type: String, required: true }
    },
    {
        collection: 'auctionInquiry'
    }
)

const partsInquiry = new mongoose.Schema(
    {
        make : {type: String, required: true},
        model: {type: String, required: true},
        mfgYear: {type: Number, required: true},
        chasisNo: {type: String, required: true},
        engineModel: {type: String, required: true},
        condition: {type: String, required: true},
        shippingMethod: {type: String, required: true},
        msgType: {type: Array, required: true},
        userMsg: {type: String, required: true},
        title: {type: String, required: true},
        userName: {type: String, required: true},
        country: {type: String, required: true},
        port: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        whatsapp: String,
        person: {type: String, required: true},
    },
    {
        collection: 'partsInquiry'
    }
)

const carQuery = new mongoose.Schema(
    {
        model: String
    },
    {
        collection: 'toyota'
    }
)

const registerIndividualUser = mongoose.model('registerIndividual', registerIndividual);
const registerTraderUser = mongoose.model('registerTrader', registerTrader)
const registerGoogleUser = mongoose.model('registerGoogle', registerGoogle)
const userAuctionInquiry = mongoose.model('auctionInquiry', auctionInquiry);
const userPartsInquiry = mongoose.model('partsInquiry', partsInquiry);
const userFeedbackQuery = mongoose.model('userFeedback', userFeedback);
const uploadModel = mongoose.model('toyota', carQuery);
const contactUserQuery = mongoose.model('contactQuery', contactQuery);

const models = {
    registerIndividualUser,
    registerTraderUser,
    registerGoogleUser,
    userAuctionInquiry,
    userPartsInquiry,
    userFeedbackQuery,
    uploadModel,
    contactUserQuery
}

module.exports = models;
