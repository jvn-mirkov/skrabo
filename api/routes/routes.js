const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');


router.post("/createRoom", Controller.createRoom);

router.get("/socketPort", (req, res, next) => {
    res.json({url: (process.env.PORT || 3000)});
});

router.get("/getName/:idSobe", Controller.getNameOfRoom);

/*
path that catches data from
dialog form
 */
router.patch("/sendRules", Controller.setRules);
module.exports = router;
