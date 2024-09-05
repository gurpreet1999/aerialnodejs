const express = require('express');
const router = express.Router();
const showreelController = require('../../Controller/PartnerController/PartnerShowReel');


router.get("/", showreelController.GetAllShowreels)
router.post("/", showreelController.AddShowreel)
router.get("/:showreelId", showreelController.GetSpecificShowreel)
router.put("/:showreelId", showreelController.UpdateShowreel)
router.delete("/:showreelId", showreelController.DeleteShowreel)




module.exports = router;