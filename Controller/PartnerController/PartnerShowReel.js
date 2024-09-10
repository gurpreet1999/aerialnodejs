



const addShowreel = async (req, res) => {
  const { partnerId } = req.params; 
  const {
    showreel_name,
    showreel_description,
    youtube_video_link,
    keyword,
    category,
  } = req.body; 

  try {
    const partnerRepo = getRepository(Partner);
    const showreelRepo = getRepository(PartnerShowreel);

   
    const partner = await partnerRepo.findOne({ where: { id: partnerId } });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

   
    const newShowreel = showreelRepo.create({
      partner,
      showreel_name,
      showreel_description,
      youtube_video_link,
      keyword,
      category,
    });

   
    await showreelRepo.save(newShowreel);

    res.status(201).json({ message: 'Showreel added successfully', showreel: newShowreel });
  } catch (error) {
    console.error('Error adding showreel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateShowreel = async (req, res) => {
  const { showreelId } = req.params;
  const {
    showreel_name,
    showreel_description,
    youtube_video_link,
    keyword,
    category,
  } = req.body; 

  try {
    const showreelRepo = getRepository(PartnerShowreel);

  
    const showreel = await showreelRepo.findOne({ where: { id: showreelId } });
    if (!showreel) {
      return res.status(404).json({ message: 'Showreel not found' });
    }

  
    showreel.showreel_name = showreel_name || showreel.showreel_name;
    showreel.showreel_description = showreel_description || showreel.showreel_description;
    showreel.youtube_video_link = youtube_video_link || showreel.youtube_video_link;
    showreel.keyword = keyword || showreel.keyword;
    showreel.category = category || showreel.category;

  
    await showreelRepo.save(showreel);

    res.status(200).json({ message: 'Showreel updated successfully', showreel });
  } catch (error) {
    console.error('Error updating showreel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteShowreel = async (req, res) => {
  const { showreelId } = req.params;

  try {
    const showreelRepo = getRepository(PartnerShowreel);


    
    const showreel = await showreelRepo.findOne({ where: { id: showreelId } });
    if (!showreel) {
      return res.status(404).json({ message: 'Showreel not found' });
    }

  
    await showreelRepo.remove(showreel);

    res.status(200).json({ message: 'Showreel deleted successfully' });
  } catch (error) {
    console.error('Error deleting showreel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  addShowreel,
  deleteShowreel ,
  updateShowreel

};
