
const express = require('express');
const droneRoute = express.Router();
const droneController = require('../../Controller/PartnerController/PartnerDrone')

droneRoute.get("/", droneController.GetAllDrones);

droneRoute.get("/:droneId", droneController.GetSpecificDrone)
droneRoute.post("/", droneController.AddDrone)
droneRoute.put("/:droneId", droneController.UpdateDrone)
droneRoute.delete("/:droneId", droneController.DeleteDrone)


module.exports = droneRoute;