const express = require('express');
const router = express.Router();

const partnerController = require('../../Controller/PartnerController/partnerSkill');

// Get all Skills
router.get('/skilllist', partnerController.getDefaultSkills)
router.get("/", partnerController.GetAllSkillsForUser);

// Update/Add Skills
router.put("/", partnerController.UpdatePartnerSkill);

module.exports = router;