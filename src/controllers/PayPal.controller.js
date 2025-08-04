const express = require('express');
const ZarinpalCheckout = require('zarinpal-checkout');

const app = express();
const zarinpal = ZarinpalCheckout.create('bde7d7dd-2145-40a5-8c6e-b15189e362a7', true); // true برای حالت sandbox

const payment = (req, res) => {
    zarinpal.PaymentRequest({
        Amount: 1000, // مبلغ به تومان
        CallbackURL: 'http://localhost:8080/api/v1/paypal/verify',
        Description: 'توضیحات پرداخت',
    }).then(response => {
        if (response.status === 100) {
        res.redirect(response.url);
        } else {
        res.send('خطا در ایجاد پرداخت');
        }
    }).catch(err => {
        res.status(500).json({
            success: false,
            message: 'خطا در پردازش درخواست',
            error: err.message || 'خطای ناشناخته'
        });
    });
}

const verify = (req, res) => {
    const { Authority, Status } = req.query;
        if (Status === 'OK') {
          zarinpal.PaymentVerification({
            Amount: 1000,
            Authority: Authority,
          }).then(response => {
            if (response.status === 100) {
              res.send('پرداخت موفق بود');
            } else {
              res.send('پرداخت ناموفق بود');
            }
          }).catch(err => {
            res.send('خطا در تأیید پرداخت: ' + err);
          });
        } else {
          res.send('پرداخت لغو شد');
        }
}

module.exports = {
    payment,
    verify
}

