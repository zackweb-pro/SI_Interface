const express = require("express");
const { getAllAdmins, createAdmin, getDemandes, confirmDemande } = require("../controllers/adminController");

const router = express.Router();

// Get all admins
router.get("/", getAllAdmins);


// Create a new admin
router.get("/demandes", getDemandes);

router.post("/confirm-demandes", confirmDemande);


module.exports = router;
