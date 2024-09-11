
const express = require('express');
const droneRoute = express.Router();
const droneController = require('../../Controller/PartnerController/PartnerDrone')

droneRoute.get("/", droneController.getAllDronesByPartner);

// droneRoute.get("/:droneId", droneController.)
droneRoute.post("/", droneController.addDrone)
droneRoute.put("/:droneId", droneController.updateDrone)
droneRoute.delete("/:droneId", droneController.deleteDrone)


module.exports = droneRoute;