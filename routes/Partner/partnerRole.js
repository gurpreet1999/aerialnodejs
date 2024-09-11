const express = require('express');
const router = express.Router();

const partnerController = require('../../Controller/PartnerController/PartnerRole');

// Update/Add Role
router.put("/", partnerController.addOrUpdateRole);

module.exports = router;