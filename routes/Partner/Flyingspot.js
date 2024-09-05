const express = require('express');
const flyingspotRoute = express.Router();

const baseRoute = "/:spotId";

flyingspotRoute.get(`${baseRoute}`);

flyingspotRoute.get(`${baseRoute}/like`);

flyingspotRoute.delete(`${baseRoute}/unlike`);

flyingspotRoute.get(`${baseRoute}/follow`)

flyingspotRoute.delete(`${baseRoute}/unfollow`);

flyingspotRoute.get(`${baseRoute}/rate`);

flyingspotRoute.post(`${baseRoute}/comment`);

flyingspotRoute.put(`${baseRoute}/comment`);

flyingspotRoute.post(`${baseRoute}/media`);




module.exports =flyingspotRoute;