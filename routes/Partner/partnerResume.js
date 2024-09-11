const express = require("express");
const router = express.Router();
const partnerResumeController = require("../../Controller/PartnerController/PartnerResume");

// router.get("/", partnerResumeController.showExperience);
// router.get("/:experienceId", partnerResumeController.viewSpecificExperience);
router.post("/", partnerResumeController.addExperienceToResume);
router.put("/:experienceId", partnerResumeController .updateExperience);
router.delete("/:experienceId", partnerResumeController .deleteExperience);

module.exports = router;
