const express = require("express");
const { applyForOffer, getOffersByUser, getOffers, getCandidatures, approveCandidature, getApprovedCandidatures, confirmAttendance } = require("../controllers/offerController");

const router = express.Router();

// Get all admins
router.post("/", applyForOffer);
router.get("/:userId", getOffersByUser);
router.get("/get/:respo_id", getOffers);
router.get("/candidatures/:offer_id", getCandidatures);
router.post("/candidature/confirm/:id", approveCandidature);
router.get("/candidatures/approved", getApprovedCandidatures);
router.put("/candidatures/confirm/:id", confirmAttendance);


module.exports = router;
