const express = require("express");
const router = express.Router();

const certificateRoute = require("./PartnerCertificate");
const equipmentRoute = require("./PartnerEquipment");
const serviceRoute = require("./PartnerService");
const showreelRoute = require("./PartnerShowreel");
const droneRoute = require("./PartnerDrone");
const PartnerRoute = require("./Partner");

const skillRoute = require("./partnerSkills");
const rolesRoute = require("./partnerRole");
const partnerResumeRoute = require("./partnerResume");
const partnerProfileRoute = require('./partnerProfile');
const partnerPublicProfileRoute = require('./partnerPublicProfile');
// const uploadMedia = require('./uploadMedia')
const uploadMediaRoute = require('./uploadMedia');

const baseRoute = "/:partnerId";

const {isAuthenticatedUser} = require('../../Middleware/Authentication')

router.use(
  `${baseRoute}/upload`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  uploadMediaRoute
);

// router.use(
//   `${baseRoute}/flyingspot`,
//   (req, res, next) => {
//     req.locals = { partnerId: req.params.partnerId };
//     next();
//   },
//   flyingspotRoute
// );

router.use(
  "/",
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  PartnerRoute
);

router.use(`/private/:partnerId`, isAuthenticatedUser,(req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  partnerProfileRoute
)

router.use('/getFullPublicProfile/:partnerId',(req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  partnerPublicProfileRoute
)

router.use(
  `${baseRoute}/certificates`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  certificateRoute
);

router.use(
  `${baseRoute}/equipments`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  equipmentRoute
);

router.use(
  `${baseRoute}/services`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  serviceRoute
);

router.use(
  `${baseRoute}/showreels`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  showreelRoute
);

router.use(
  `${baseRoute}/drones`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  droneRoute
);

router.use(
  `${baseRoute}/skills`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  skillRoute
);

router.use(
  `${baseRoute}/role`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  rolesRoute
);

router.use(
  `${baseRoute}/resume`,isAuthenticatedUser,
  (req, res, next) => {
    req.locals = { partnerId: req.params.partnerId };
    next();
  },
  partnerResumeRoute
);

// router.use(
//   `${baseRoute}/upload`,isAuthenticatedUser,
//   (req, res, next) => {
//     req.locals = { partnerId: req.params.partnerId };
//     next();
//   },
//   uploadMedia
// );

module.exports = router;
