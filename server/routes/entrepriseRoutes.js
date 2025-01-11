const express = require("express");
const { createOffer } = require("../controllers/entrepriseController");
const router = express.Router();



router.post("/create-offre", createOffer);



module.exports = router;
