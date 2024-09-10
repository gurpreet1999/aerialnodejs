


const { getRepository } = require('typeorm');
const {PartnerSchema,SkillsSchema} = require('../../entities/partner/partner.js'); 














const addOrUpdateSkillsForPartner = async (req, res) => {
  const partnerId = parseInt(req.params.partnerId, 10); 
  const { skillIds } = req.body;

  try {
   
    if (!Array.isArray(skillIds) || skillIds.some(id => isNaN(id))) {
      return res.status(400).json({ message: 'Invalid skill IDs' });
    }

    const partnerRepo = getRepository(PartnerSchema);
    const skillRepo = getRepository(SkillsSchema);

   
    const partner = await partnerRepo.findOne({
      where: { id: partnerId },
      relations: ['skills'], // Ensure skills relation is loaded
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

   
    const skills = await skillRepo.findByIds(skillIds);

   
    if (skills.length !== skillIds.length) {
      return res.status(404).json({ message: 'Some skills not found' });
    }

  
    partner.skills = skills;

    
    await partnerRepo.save(partner);

    res.status(200).json({ message: 'Skills updated successfully', partner });
  } catch (error) {
    console.error('Error adding/updating skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllSkillsOfPartner = async (req, res) => {
  const partnerId = parseInt(req.params.partnerId, 10); 

  try {
    const partnerRepo = getRepository(PartnerSchema);

    // Fetch the partner entity including skills
    const partner = await partnerRepo.findOne({
      where: { id: partnerId },
      relations: ['skills'], // Ensure skills relation is loaded
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Extract skills from the partner
    const skills = partner.skills;

    res.status(200).json({ message: 'Skills retrieved successfully', skills });
  } catch (error) {
    console.error('Error retrieving partner skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = { addOrUpdateSkillsForPartner,getAllSkillsOfPartner};