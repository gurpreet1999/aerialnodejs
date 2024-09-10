
const { getRepository } = require('typeorm');

const {PartnerEquipmentsSchema,PartnerMediaSchema}=require("../../entities/partner/partner.js")




const createEquipment=async(req,res)=>{

  const equipmentRepository = getRepository(PartnerEquipmentsSchema);
  const mediaRepository = getRepository(PartnerMediaSchema);



  const {
    partnerId,
    equipmentTypeId,
    equipmentName,
    equipmentModel,
    equipmentStatus,
    equipmentDescription,
    verificationStatus,
    verificationNotes,
    mediaUrls,
  } = req.body;




  const equipment = equipmentRepository.create({
    user_id: partnerId,  
    equipment_type_id: equipmentTypeId,  
    equipment_name: equipmentName,  
    equipment_model: equipmentModel, 
    equipment_status: equipmentStatus, 
    equipment_description: equipmentDescription, 
    verification_status: verificationStatus, 
    verification_notes: verificationNotes,  
  });

  const savedEquipment = await equipmentRepository.save(equipment);

  // Get the equipment ID
  const equipmentId = savedEquipment.equipment_id;

  // Prepare media entries
  const mediaEntries = mediaUrls.map(url => ({
    media_type: 'photo', 
    media_url: url,
    category_type: 'Equipment',
    category_id: equipmentId,
  }));

  // Create and save all media entries
  await mediaRepository.save(mediaEntries);

  return savedEquipment;  // Return the saved equipment if needed

}


const updateEquipment = async (req, res) => {
  const { equipmentId } = req.params;
  const {
    partnerId,
    equipmentTypeId,
    equipmentName,
    equipmentModel,
    equipmentStatus,
    equipmentDescription,
    verificationStatus,
    verificationNotes,
    mediaUrls, 
  } = req.body;

  try {
    const equipmentRepository = getRepository(PartnerEquipmentsSchema);
    const mediaRepository = getRepository(PartnerMediaSchema);

   
    const equipment = await equipmentRepository.findOne({ where: { equipment_id: equipmentId } });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

   
    equipment.user_id = partnerId || equipment.user_id;
    equipment.equipment_type_id = equipmentTypeId || equipment.equipment_type_id;
    equipment.equipment_name = equipmentName || equipment.equipment_name;
    equipment.equipment_model = equipmentModel || equipment.equipment_model;
    equipment.equipment_status = equipmentStatus || equipment.equipment_status;
    equipment.equipment_description = equipmentDescription || equipment.equipment_description;
    equipment.verification_status = verificationStatus || equipment.verification_status;
    equipment.verification_notes = verificationNotes || equipment.verification_notes;

 
    const updatedEquipment = await equipmentRepository.save(equipment);

 
    if (mediaUrls && mediaUrls.length > 0) {

      await mediaRepository.delete({ category_id: equipmentId, category_type: 'Equipment' });

    
      const mediaEntries = mediaUrls.map((url) => ({
        media_type: 'photo', 
        media_url: url,
        category_type: 'Equipment',
        category_id: equipmentId,
      }));

      await mediaRepository.save(mediaEntries);
    }

    res.status(200).json({ message: 'Equipment updated successfully', equipment: updatedEquipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const deleteEquipment = async (req, res) => {
  const { equipmentId } = req.params;

  try {
    const equipmentRepository = getRepository(PartnerEquipmentsSchema);
    const mediaRepository = getRepository(PartnerMediaSchema);

    // Find the equipment by ID
    const equipment = await equipmentRepository.findOne({ where: { equipment_id: equipmentId } });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Delete related media entries
    await mediaRepository.delete({ category_id: equipmentId, category_type: 'Equipment' });

    // Delete the equipment
    await equipmentRepository.remove(equipment);

    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getEquipmentById = async (req, res) => {
  const { equipmentId } = req.params;

  try {
    const equipmentRepository = getRepository(PartnerEquipmentsSchema);
    const mediaRepository = getRepository(PartnerMediaSchema);

    // Find the equipment by ID
    const equipment = await equipmentRepository.findOne({ where: { equipment_id: equipmentId } });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Get related media for the equipment
    const media = await mediaRepository.find({ where: { category_id: equipmentId, category_type: 'Equipment' } });

    res.status(200).json({
      message: 'Equipment fetched successfully',
      equipment,
      media, // Include media related to the equipment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getAllEquipmentOfPartner = async (req, res) => {
  const { partnerId } = req.params;

  try {
    const equipmentRepository = getRepository(PartnerEquipmentsSchema);
    const mediaRepository = getRepository(PartnerMediaSchema);

 
    const equipment = await equipmentRepository.find({
      where: { user_id: partnerId }, // Assuming 'user_id' references the partner
    });

    if (!equipment || equipment.length === 0) {
      return res.status(404).json({ message: 'No equipment found for this partner' });
    }

   
    const equipmentWithMedia = await Promise.all(
      equipment.map(async (item) => {
        const media = await mediaRepository.find({
          where: { category_id: item.equipment_id, category_type: 'Equipment' },
        });

        return {
          ...item,
          media, 
        };
      })
    );

    res.status(200).json({
      message: 'Equipment fetched successfully',
      equipment: equipmentWithMedia, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createEquipment,
  deleteEquipment,
  updateEquipment,
  getEquipmentById,
  getAllEquipmentOfPartner,
};
