const express = require('express');
const router = express.Router();
const equipmentController = require('../../Controller/PartnerController/PartnerEquipments')

router.get("/", equipmentController.getAllEquipmentOfPartner)
router.get("/:equipmentId",equipmentController.getEquipmentById)

router.post("/",equipmentController.createEquipment)
router.put("/:equipmentId", equipmentController.updateEquipment)
router.delete("/:equipmentId", equipmentController.deleteEquipment)



module.exports = router;