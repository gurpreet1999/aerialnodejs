const { getRepository } = require('typeorm');

const {PartnerSchema,PartnerRolesListSchema}=require("../../entities/partner/partner.js")



const addOrUpdateRole = async (req, res) => {
  try {
    const partnerId = parseInt(req.params.partnerId, 10); 
    const roleIds = req.body.roleIds;

   
    if (!Array.isArray(roleIds) || roleIds.some(id => isNaN(id))) {
      return res.status(400).json({ message: 'Invalid role IDs' });
    }

    const partnerRepo = getRepository(PartnerSchema);
    const roleRepo = getRepository(PartnerRolesListSchema);
    
   
    const partner = await partnerRepo.findOne({
      where: { id: partnerId },
      relations: ['roles'], 
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

   
    const roles = await roleRepo.findByIds(roleIds);

    if (!roles.length) {
      return res.status(404).json({ message: 'No valid roles found' });
    }

   
    partner.roles = roles;

   
    await partnerRepo.save(partner);

    res.status(200).json({ message: 'Roles updated successfully', partner });
  } catch (error) {
    console.error('Error adding/updating roles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { addOrUpdateRole  };