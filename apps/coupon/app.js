const {
  getCouponsByRange,
  add,
  get,
  transferCoupon,
  remove,
  getHistoryForCoupon
} = require("./cfuncs");

const express = require("express");
var bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const port = 3000;

errHandler = function(err, res) {
  res.status(500).send(err.message);
};

successJSON = {
  "message": "success"
}

// getCouponsByRange | READ
app.get("/coupons", async function(req, res) {
  try {
    from = req.query.from;
    to = req.query.to;
    result = await getCouponsByRange(from, to);
    arr = JSON.parse(result);
    arr = arr.map(function(o) {
      return o.Record;
    });

    res.json(arr);
  } catch (err) {
    errHandler(err, res);
  }
});

// add
app.post("/coupon", async function(req, res) {
  try {
    cp = req.body;
    result = await add(cp.code, cp.owner, cp.name, cp.note);
    res.json(successJSON)
  } catch (err) {
    errHandler(err, res);
  }
});

// get | READ
app.get("/coupon/:code", async function(req, res) {
  try {
    code = req.params.code;
    result = await get(code);
    res.json(JSON.parse(result));
  } catch (err) {
    errHandler(err, res);
  }
});

// transferCoupon
app.put("/transfer/:code", async function(req, res) {
  try {
    code = req.params.code;
    newOwner = req.query.user;
    result = await transferCoupon(code, newOwner);
    res.json(successJSON)
  } catch (err) {
    errHandler(err, res);
  }
});

// remove
app.delete("/coupon/:code", async function(req, res) {
  try {
    code = req.params.code;
    result = await remove(code);
    res.json(successJSON)
  } catch (err) {
    errHandler(err, res);
  }
});

// getHistoryForCoupon | READ
app.get("/history/:code", async function(req, res) {
  try {
    code = req.params.code;
    result = await getHistoryForCoupon(code);
    res.json(JSON.parse(result));
  } catch (err) {
    errHandler(err, res);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
