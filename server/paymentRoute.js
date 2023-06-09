const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const PaytmChecksum = require("./PaytmChecksum");
const { v4: uuidv4 } = require("uuid");
const formidable = require("formidable");
const https = require("https");
const nodemailer = require("nodemailer");
const app = express();

var userEmailId;
var ebooklink;
const MerchantID = "enter_your_merchant_id";
const MerchantKey = "enter_your_merchant_key";

// Sending an email to buyer after the purchase.
// If you do not wish to have this feature delete the code starting from line 18 to line 41 and also line 96 where this function is called.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "enter_your_email",
    pass: "enter_authorisation_password",  // Remember authorisation password is different from the password you use to login you email account with.
  },
});

const handleSubmit = async (data) => {
  console.log(userEmailId);
  const message = {
    from: "senders_Email",  //Enter your email
    to: userEmailId,
    subject: `Order Placed`, // Email subject
    text: `Thankyou for buying from us`,  // Email body
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log("Error" + err.message);
    } else {
      console.log("Message Sent:" + info.response);
    }
  });
};

router.post("/callback", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
    paytmChecksum = fields.CHECKSUMHASH;
    delete fields.CHECKSUMHASH;

    var isVerifySignature = PaytmChecksum.verifySignature(
      fields,
      MerchantKey,
      paytmChecksum
    );
    if (isVerifySignature) {
      var paytmParams = {};
      paytmParams.body = {
        mid: fields.MID,
        orderId: fields.ORDERID,
      };
      PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        MerchantKey
      ).then(function (checksum) {
        paytmParams.head = {
          signature: checksum,
        };
        var post_data = JSON.stringify(paytmParams);
        var options = {
          /* for Staging */
          hostname: "securegw-stage.paytm.in",

          /* for Production */
          // hostname: 'securegw.paytm.in',

          port: 443,
          path: "/v3/order/status",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };

        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });
          post_res.on("end", function () {
            //
            if (fields.STATUS === "TXN_SUCCESS") {
              // Transaction Success
              handleSubmit();
            } else {
              // Transaction Failed
            }
          });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
      });
    } else {
      console.log("Checksum Mismatched");
    }
  });
});

//****************************************

router.post("/payment", (req, res) => {
  const { amount, email, basket, database, ebookLink } = req.body;
  userEmailId = email;
  ebooklink = ebookLink;
  const totalAmount = JSON.stringify(amount);
  var params = {};
  params["MID"] = MerchantID;
  params["WEBSITE"] = "WEBSTAGING";  // When in production change "WEBSTAGING" to "DEFAULT"
  params["CHANNEL_ID"] = "WEB";
  params["CUST_ID"] = email;
  params["ORDER_ID"] = uuidv4();
  params["TXN_AMOUNT"] = totalAmount;
  params["CALLBACK_URL"] = "http://localhost:60/api/callback";
  params["EMAIL"] = email;
  app.post("/databaseData", function (req, res) {
    results = params["ORDER_ID"];
    res.send(JSON.stringify(results));
  });
  var paytmChecksum = PaytmChecksum.generateSignature(
    params,
    MerchantKey
  );
  paytmChecksum
    .then(function (checksum) {
      let paytmParams = {
        ...params,
        CHECKSUMHASH: checksum,
      };
      res.json(paytmParams);
    })
    .catch(function (error) {
      console.log(error);
    });
});

//****************************************

module.exports = router;
