require('dotenv').config({path: "./config.env"})
const express = require('express')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const bodyparser = require("body-parser");
const passport=require('passport');
const cors=require("cors");
const compression = require('compression');


//const {getOneOrder} = require("./controllers/handleOrder");
const {orderQueue} = require("./controllers/orderQueue");


//getOneOrder()
orderQueue()
connectDB();

const app = express()

const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}


app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize());

app.use('/media/img/',express.static('media/img'));

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))


app.use('/admin', require('./routes/auth'));
app.use("/admin", require("./routes/private"));
app.use("/admin/user", require("./routes/user"));
app.use("/admin/product", require("./routes/products"));
app.use("/admin", require("./routes/logout"));
app.use("/auth/google",require("./routes/authGoogleRouter"));
app.use("/auth/facebook",require("./routes/authFacebookRouter"));
app.use("/admin/banner", require("./routes/banner"));
app.use("/count", require("./routes/visitors"));
app.use('/addWallet', require("./routes/addWallet"))
app.use("/admin/purchase", require("./routes/purchase"));
app.use("/admin/addwallet", require("./routes/addWallet"));
app.use("/admin/order", require("./routes/order"));
app.use("/admin/wallet", require("./routes/wallet"));
app.use("/notification", require("./routes/notification"));
app.use("/notification/admin", require("./routes/adminNotification"));
// app.use(/findOrder/, require("./routes/manageOrder"));
app.use("/dashboard/order/query", require("./routes/orderQuery"));
app.use ("/search/", require("./routes/search"));
app.use ("/support", require("./routes/support"))
app.use ("/paymentMethod", require("./routes/paymentMethods"));
app.use ("/popUpBanner", require("./routes/popUpBanner"));

app.use ("/sendMessage", require("./routes/sendMessage"))
//app.use("/rating", require("./routes/rating"))

app.use("/active",require("./routes/activeUser"))

//app.use("/adminRating", require("./routes/adminRating"));




app.use(errorHandler);

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () =>
  console.log(`Sever running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err.message}`);
    server.close(() => process.exit(1));
  });