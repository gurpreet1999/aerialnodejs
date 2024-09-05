const express = require('express');
const router = express.Router();
const equipmentController = require('../../Controller/PartnerController/PartnerEquipments')

router.get("/", equipmentController.GetAllEquipment)
router.get("/:equipmentId",equipmentController.GetSpecificEquipment)

router.post("/",equipmentController.AddEquipment)
router.put("/:equipmentId", equipmentController.UpdateEquipment)
router.delete("/:equipmentId", equipmentController.DeleteEquipment)



module.exports = router;