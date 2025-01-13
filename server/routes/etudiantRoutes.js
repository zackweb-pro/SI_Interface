// backend/routes/etudiantRoutes.js
const express = require('express');
const router = express.Router();
const {getEtudiantsByEcole, deleteEtudiant, updateEtudiant} = require('../controllers/EtudiantController');

// Get all etudiants for a specific ecole
router.get('/ecole', getEtudiantsByEcole);

// Delete a specific etudiant
router.delete('/:id', deleteEtudiant);

// Update a specific etudiant
router.put('/:id', updateEtudiant);

module.exports = router;