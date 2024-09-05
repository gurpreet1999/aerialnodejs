const express = require("express");
const router = express.Router();
const experienceController = require("../../Controller/PartnerController/PartnerExperience");

router.get("/", experienceController.showExperience);
router.get("/:experienceId", experienceController.viewSpecificExperience);
router.post("/", experienceController.addPartnerExperience);
router.put("/:experienceId", experienceController.updateExperience);
router.delete("/:experienceId", experienceController.deleteExperience);

module.exports = router;
