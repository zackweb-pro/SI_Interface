const express = require("express");
const router = express.Router();
const respoController = require("../controllers/respoController");

router.get("/ecoles", respoController.getEcoles);
router.get("/entreprises", respoController.getEntreprises);

// Routes for creating new accounts
router.post("/respo-ecole", respoController.createRespoEcole);
router.post("/respo-entreprise", respoController.createRespoEntreprise);

module.exports = router;
