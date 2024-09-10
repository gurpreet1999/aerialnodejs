





const UpdatePartnerDetail=async(req,res)=>{

}






const addOrUpdatePartnerSocialDetails = async (req, res) => {
    const { partnerId } = req.params; 
    const {
      facebook_link,
      instagram_link,
      linkedin_link,
      website_link,
      reach_in_kms,
      google_id
    } = req.body; 
  
    const partnerRepository = getRepository(PartnerSchema);
    const socialDetailsRepository = getRepository(PartnerSocialDetailsSchema);
  
    try {
    
      const partner = await partnerRepository.findOne({ where: { id: partnerId } });
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found' });
      }
     let socialDetails = await socialDetailsRepository.findOne({ where: { partnerId } });
  
      if (socialDetails) {
     
        socialDetails.facebook_link = facebook_link;
        socialDetails.instagram_link = instagram_link;
        socialDetails.linkedin_link = linkedin_link;
        socialDetails.website_link = website_link;
        socialDetails.reach_in_kms = reach_in_kms;
        socialDetails.google_id = google_id;
      } else {
       
        socialDetails = socialDetailsRepository.create({
          partnerId,
          facebook_link,
          instagram_link,
          linkedin_link,
          website_link,
          reach_in_kms,
          google_id
        });
      }
  
   
      await socialDetailsRepository.save(socialDetails);
  
      res.status(200).json({ message: 'Partner social details added/updated successfully', data: socialDetails });
    } catch (error) {
      console.error('Error adding/updating partner social details:', error);
      res.status(500).json({ error: error.message });
    }
  };


const addOrUpdateLocation = async (req, res) => {
  const { locationId, partnerId, location_name, country_id, state_id, city_id, location_lat, location_long } = req.body;

  try {
    const partnerRepo = getRepository(PartnerSchema);
    const locationRepo = getRepository(PartnerLocationSchema);

   
    const partner = await partnerRepo.findOne({ where: { id: partnerId } });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

   
    let location = null;
    if (locationId) {
      location = await locationRepo.findOne({ where: { location_id: locationId } });
    }

    if (location) {
     
      location.location_name = location_name || location.location_name;
      location.country_id = country_id || location.country_id;
      location.state_id = state_id || location.state_id;
      location.city_id = city_id || location.city_id;
      location.location_lat = location_lat || location.location_lat;
      location.location_long = location_long || location.location_long;
    } else {
   
      location = locationRepo.create({
        partner: partner,
        location_name,
        country_id,
        state_id,
        city_id,
        location_lat,
        location_long,
      });
    }

  
    await locationRepo.save(location);

    res.status(200).json({
      message: locationId ? 'Location updated successfully' : 'Location added successfully',
      location,
    });
  } catch (error) {
    console.error('Error adding or updating location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const addOrUpdateUserLanguages = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { languageIds } = req.body;

  if (!Array.isArray(languageIds) || languageIds.some(id => isNaN(id))) {
    return res.status(400).json({ message: 'Invalid language IDs' });
  }

  try {
    const userRepo = getRepository(UserSchema);
    const languageRepo = getRepository(LanguageSchema);

    // Fetch the user
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['languages'], // Ensure languages relation is loaded
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the languages
    const languages = await languageRepo.findByIds(languageIds);

    // Check if all provided languages exist
    if (languages.length !== languageIds.length) {
      return res.status(404).json({ message: 'One or more languages not found' });
    }

    // Update the user's languages
    user.languages = languages;
    await userRepo.save(user);

    res.status(200).json({ message: 'Languages added/updated successfully', user });
  } catch (error) {
    console.error('Error adding/updating languages for user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports = {
  addOrUpdateUserLanguages,
  addOrUpdateLocation ,
  addOrUpdatePartnerSocialDetails,


};

