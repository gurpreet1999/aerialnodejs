const express = require("express");
const router = express.Router();
const serviceController = require('../../Controller/PartnerController/PartnerServices');

router.get("/", serviceController.GetAllServices);
router.get("/:serviceId", serviceController.GetSpecificService);
router.post("/",serviceController.AddService);
router.put("/:serviceId", serviceController.UpdateService);
router.delete("/:serviceId", serviceController.DeleteService);

module.exports = router;
