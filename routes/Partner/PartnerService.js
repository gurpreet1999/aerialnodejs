const express = require("express");
const router = express.Router();
const serviceController = require('../../Controller/PartnerController/PartnerServices');

// router.get("/", serviceController.GetAllServices);
// router.get("/:serviceId", serviceController.GetSpecificService);
router.post("/",serviceController.addService);
router.put("/:serviceId", serviceController.updateService);
router.delete("/:serviceId", serviceController.deleteService);



// router.post("/:serviceId", serviceController.deleteService);
// router.delete("/:serviceId", serviceController.deleteService);
// router.delete("/:serviceId", serviceController.deleteService);
// router.delete("/:serviceId", serviceController.deleteService);









module.exports = router;
