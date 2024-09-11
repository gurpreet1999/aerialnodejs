const express = require('express');
const router = express.Router();
const partnerCertificate = require('../../Controller/PartnerController/PartnerCertificate')


router.get("/",partnerCertificate.getCertificatesByPartner)
router.post("/", partnerCertificate.addCertificate)
router.get("/:certificateId", partnerCertificate.getCertificateById)

router.put("/:certificateId", partnerCertificate.updateCertificate)
router.delete("/:certificateId", partnerCertificate.deleteCertificate)


module.exports = router;