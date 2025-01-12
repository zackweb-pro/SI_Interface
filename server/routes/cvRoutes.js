const express = require("express");
const { setCv, getCv } = require("../controllers/cvController");
const router = express.Router();


router.post("/", setCv);
router.get("/:userId", getCv);



module.exports = router;
