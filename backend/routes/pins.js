const router = require("express").Router();
const pin = require("../models/pin");

router.post("/", async (req,res)=>{
    const newPin = new pin(req.body);
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin)
    }catch(err){
        res.status(505).json(err)
    }
})

router.get("/", async (req,res) => {
    try{
        const pins = await pin.find();
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;