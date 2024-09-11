const express = require('express');
const router = express.Router();
const showreelController = require('../../Controller/PartnerController/PartnerShowReel');


// router.get("/", showreelController.)
router.post("/", showreelController.addShowreel)
// router.get("/:showreelId", showreelController.)
router.put("/:showreelId", showreelController.updateShowreel)
router.delete("/:showreelId", showreelController.deleteShowreel)




module.exports = router;