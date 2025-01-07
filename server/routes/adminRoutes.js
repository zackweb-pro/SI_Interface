const express = require("express");
const { getAllAdmins, createAdmin, getDemandes, confirmDemande, removeDemande, getConfirmedUsers, deleteUser } = require("../controllers/adminController");

const router = express.Router();

// Get all admins
router.get("/", getAllAdmins);


// Create a new admin
router.get("/demandes", getDemandes);
router.get("/confirmed-users", getConfirmedUsers);

router.post("/confirm-demande/:id/:type", confirmDemande);
router.delete("/remove-demande/:id/:type", removeDemande);
router.delete("/delete-user/:id/:type", deleteUser);


module.exports = router;
