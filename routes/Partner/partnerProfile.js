const express = require('express');
const router = express.Router();
const partnerController = require('../../Controller/PartnerController/Partner');

// router.get('/profile', partnerController.getPartner)
// router.put('/updateProfile', partnerController.updatepartner)
// router.get('/getLocation', partnerController.getlocationList)
router.put('/updateLocation', partnerController.addOrUpdateLocation)
router.put('/updateLanguage', partnerController.addOrUpdateUserLanguages)
router.put('/addSocialdetail', partnerController.addOrUpdatePartnerSocialDetails)


// router.put('/setWorkingDistance', partnerController.setPartnerWorkingDistance)


// router.get('/getFullProfile', partnerController.getFullProfile)
// router.delete('/', partnerController.deletepartner)


module.exports = router;