const express = require('express');
const router = express.Router();
const partnerCertificate = require('../../Controller/PartnerController/PartnerCertificate')


router.get("/",partnerCertificate.GetAllCertificates)
router.post("/", partnerCertificate.AddCertificate)
router.get("/:certificateId", partnerCertificate.GetSpecificCertificate)

router.put("/:certificateId", partnerCertificate.UpdateCertificate)
router.delete("/:certificateId", partnerCertificate.DeleteCertificate)


module.exports = router;