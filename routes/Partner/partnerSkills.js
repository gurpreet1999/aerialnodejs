const express = require('express');
const router = express.Router();

const partnerController = require('../../Controller/PartnerController/partnerSkill');

// Get all Skills

router.get("/", partnerController.getAllSkillsOfPartner);

// Update/Add Skills
router.put("/", partnerController.addOrUpdateSkillsForPartner);

module.exports = router;