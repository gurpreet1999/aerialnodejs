const mysql = require("mysql2/promise");
const pool = require('../../pool');

const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

const deletepartner = async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Create a connection to the database
    const connection = await pool.getConnection();

    // Delete the partner from the database
    await connection.execute("DELETE FROM partners WHERE user_id = ?", [
      userId,
    ]);

    // Close the database connection
    connection.release();

    res.json({ message: "Partner deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatepartner = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    // Create a connection to the database
    const connection = await pool.getConnection();

    // Replace empty strings with null for social media links
    const username = req.body.username || null;
    const contactNumber = req.body.contact_number || null;
    const address = req.body.address || null;
    const profile_image_url = req.body.profile_image_url || null;
    const facebookLink = req.body.facebook || null;
    const instagramLink = req.body.instagram || null;
    const linkedinLink = req.body.linkedin || null;
    const youtubeLink = req.body.youtube || null;
    const websiteLink = req.body.website || null;

    console.log(youtubeLink);
    // Update the partner in the database
    await connection.execute(
      "UPDATE partners SET username = ?, contact_number = ?, address = ?, facebook_link = ?, instagram_link = ?, linkedin_link = ?, youtube_link = ?, website_link = ?, profile_image_url = ? WHERE user_id = ?",
      [
        username,
        contactNumber,
        address,
        facebookLink,
        instagramLink,
        linkedinLink,
        youtubeLink,
        websiteLink,
        profile_image_url,
        partnerId
      ]
    );

    // Close the database connection
    connection.release();

    res.status(200).send("Partner data Updated");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getPartner = async (req, res) => {

  try {
    // Extract partnerId from req.locals
    const { partnerId } = req.locals;

    // Create a connection to the database
    const connection = await pool.getConnection();

    // Fetch partner data based on the provided partnerId by joining tables
    const [partnerData] = await connection.execute(`
    SELECT 
    p.user_id, 
    p.username, 
    p.userurl, 
    p.contact_number, 
    p.address, 
    p.email, 
    p.country_id, 
    p.state_id, 
    p.city_id, 
    p.is_business, 
    p.business_name, 
    p.team_size, 
    p.facebook_link, 
    p.instagram_link, 
    p.linkedin_link, 
    p.youtube_link, 
    p.website_link, 
    p.reach_in_kms, 
    p.work_location_id,
    p.partner_role,
    p.profile_image_url,
    c.country_name,
    s.state_name,
    city.city_name,
    loc.location_name,
    GROUP_CONCAT(sk.skill_name) AS skills,
    GROUP_CONCAT(sk.skill_id) AS skill_ids
FROM partners p
LEFT JOIN countries c ON p.country_id = c.country_id
LEFT JOIN states s ON p.state_id = s.state_id
LEFT JOIN cities city ON p.city_id = city.city_id
LEFT JOIN locations loc ON p.work_location_id = loc.location_id
LEFT JOIN partnerskills ps ON p.user_id = ps.user_id
LEFT JOIN skills sk ON ps.skill_id = sk.skill_id
WHERE p.user_id = ?
GROUP BY p.user_id


    `, [partnerId]);

    // Close the database connection
    connection.release();

    // Respond with partner data

    // Convert skill_ids string to array
    const partnersWithSkillsArray = partnerData.map(partner => ({
      ...partner,
      skill_ids: (partner.skill_ids ? partner.skill_ids.split(",").map(Number) : [])
    }));

    // Respond with partner data
    res.json({ partners: partnersWithSkillsArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getlocationList = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [states] = await connection.execute("SELECT state_id, state_name FROM states");

    const [cities] = await connection.execute("SELECT city_id, city_name, state_id FROM cities");

    connection.release();

    res.json({ states, cities });
  } catch (error) {
    console.error("Error fetching location data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatepartnerlocation = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { city_id, state_id } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      "UPDATE partners SET city_id = ?, state_id = ? WHERE user_id = ?",
      [city_id, state_id, partnerId]
    );
    await connection.release();
    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error updating partner location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const setPartnerWorkingDistance = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { workingDistance } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      "UPDATE partners SET reach_in_kms = ? WHERE user_id = ?",
      [workingDistance, partnerId]
    );
    await connection.release();

    res.status(200).send("Working Distance Updated");
  } catch (error) {
    console.error("Error updating working Distance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFullProfile = async (req, res) => {
  try {
    const { partnerId } = req.locals;

    const connection = await pool.getConnection();

    // For Profile
    const [[user]] = await connection.execute(`
      SELECT 
      p.user_id, 
      p.username, 
      p.contact_number, 
      p.address, 
      p.email, 
      p.country_id, 
      p.state_id, 
      p.city_id, 
      p.is_business, 
      p.business_name, 
      p.team_size, 
      p.facebook_link, 
      p.instagram_link, 
      p.linkedin_link, 
      p.youtube_link, 
      p.website_link, 
      p.reach_in_kms, 
      p.work_location_id,
      p.partner_role,
      p.profile_image_url,
      c.country_name,
      s.state_name,
      city.city_name,
      loc.location_name,
      GROUP_CONCAT(sk.skill_name) AS skills
      FROM partners p
      LEFT JOIN countries c ON p.country_id = c.country_id
      LEFT JOIN states s ON p.state_id = s.state_id
      LEFT JOIN cities city ON p.city_id = city.city_id
      LEFT JOIN locations loc ON p.work_location_id = loc.location_id
      LEFT JOIN partnerskills ps ON p.user_id = ps.user_id
      LEFT JOIN skills sk ON ps.skill_id = sk.skill_id
      WHERE p.userurl = ?
      GROUP BY p.user_id
    `, [partnerId]);

    // For Service
    const [services] = await connection.execute(
      `SELECT
          ms.service_id,
          ms.user_id,
          ms.service_name,
          ms.category,
          ms.service_description,
          ms.service_price,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          myservices ms
      JOIN
          partnermedia pm ON ms.media_id = pm.media_id
      WHERE
          ms.user_id = ?`,
      [user.user_id]
    );

    // For Equipmnets
    const [equipments] = await connection.execute(
      `SELECT
          me.equipment_id,
          me.user_id,
          me.equipment_name,
          me.equipment_description,
          me.category,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          myequipments me
      JOIN
          partnermedia pm ON me.media_id = pm.media_id
      WHERE
          me.user_id = ?`,
      [user.user_id]
    );

    // For Showreels
    const [showreels] = await connection.execute(
      `SELECT
          ms.showreel_id,
          ms.user_id,
          ms.showreel_title,
          ms.showreel_description,
          ms.showreel_price,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          myshowreel ms
      JOIN
          partnermedia pm ON ms.media_id = pm.media_id
      WHERE
          ms.user_id = ?`,
      [user.user_id]
    );
    connection.release();
    return res.status(200).json({
      user,
      services,
      equipments,
      showreels,
    });
  } catch (error) {
    console.error("Error Getting Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





module.exports = {
  deletepartner,
  updatepartner,
  getPartner,
  getlocationList,
  updatepartnerlocation,
  setPartnerWorkingDistance,
  getFullProfile,
};



// const addOrUpdatePartnerSocialDetails = async (req, res) => {
//     const { partnerId } = req.params; // Extract partnerId from route parameters
//     const {
//       facebook_link,
//       instagram_link,
//       linkedin_link,
//       website_link,
//       reach_in_kms,
//       google_id
//     } = req.body; // Extract social details from the request body
  
//     const partnerRepository = getRepository(PartnerSchema);
//     const socialDetailsRepository = getRepository(PartnerSocialDetailsSchema);
  
//     try {
//       // Find the partner by ID using a proper condition
//       const partner = await partnerRepository.findOne({ where: { id: partnerId } });
//       if (!partner) {
//         return res.status(404).json({ error: 'Partner not found' });
//       }
  
//       // Check if social details already exist for this partner
//       let socialDetails = await socialDetailsRepository.findOne({ where: { partnerId } });
  
//       if (socialDetails) {
//         // Update existing social details
//         socialDetails.facebook_link = facebook_link;
//         socialDetails.instagram_link = instagram_link;
//         socialDetails.linkedin_link = linkedin_link;
//         socialDetails.website_link = website_link;
//         socialDetails.reach_in_kms = reach_in_kms;
//         socialDetails.google_id = google_id;
//       } else {
//         // Create new social details
//         socialDetails = socialDetailsRepository.create({
//           partnerId,
//           facebook_link,
//           instagram_link,
//           linkedin_link,
//           website_link,
//           reach_in_kms,
//           google_id
//         });
//       }
  
//       // Save the social details
//       await socialDetailsRepository.save(socialDetails);
  
//       res.status(200).json({ message: 'Partner social details added/updated successfully', data: socialDetails });
//     } catch (error) {
//       console.error('Error adding/updating partner social details:', error);
//       res.status(500).json({ error: error.message });
//     }
//   };


// const addOrUpdateLocation = async (req, res) => {
//   const { locationId, partnerId, location_name, country_id, state_id, city_id, location_lat, location_long } = req.body;

//   try {
//     const partnerRepo = getRepository(PartnerSchema);
//     const locationRepo = getRepository(PartnerLocationSchema);

   
//     const partner = await partnerRepo.findOne({ where: { id: partnerId } });
//     if (!partner) {
//       return res.status(404).json({ message: 'Partner not found' });
//     }

   
//     let location = null;
//     if (locationId) {
//       location = await locationRepo.findOne({ where: { location_id: locationId } });
//     }

//     if (location) {
     
//       location.location_name = location_name || location.location_name;
//       location.country_id = country_id || location.country_id;
//       location.state_id = state_id || location.state_id;
//       location.city_id = city_id || location.city_id;
//       location.location_lat = location_lat || location.location_lat;
//       location.location_long = location_long || location.location_long;
//     } else {
   
//       location = locationRepo.create({
//         partner: partner,
//         location_name,
//         country_id,
//         state_id,
//         city_id,
//         location_lat,
//         location_long,
//       });
//     }

  
//     await locationRepo.save(location);

//     res.status(200).json({
//       message: locationId ? 'Location updated successfully' : 'Location added successfully',
//       location,
//     });
//   } catch (error) {
//     console.error('Error adding or updating location:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// const addOrUpdateUserLanguages = async (req, res) => {
//   const userId = parseInt(req.params.userId, 10);
//   const { languageIds } = req.body;

//   if (!Array.isArray(languageIds) || languageIds.some(id => isNaN(id))) {
//     return res.status(400).json({ message: 'Invalid language IDs' });
//   }

//   try {
//     const userRepo = getRepository(UserSchema);
//     const languageRepo = getRepository(LanguageSchema);

//     // Fetch the user
//     const user = await userRepo.findOne({
//       where: { id: userId },
//       relations: ['languages'], // Ensure languages relation is loaded
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Fetch the languages
//     const languages = await languageRepo.findByIds(languageIds);

//     // Check if all provided languages exist
//     if (languages.length !== languageIds.length) {
//       return res.status(404).json({ message: 'One or more languages not found' });
//     }

//     // Update the user's languages
//     user.languages = languages;
//     await userRepo.save(user);

//     res.status(200).json({ message: 'Languages added/updated successfully', user });
//   } catch (error) {
//     console.error('Error adding/updating languages for user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
