

const { getRepository } = require('typeorm');

const {PartnerDroneSchema,PartnerDroneTypeSchema}=require("../../entities/partner/partner.js")







const addDrone = async (req, res) => {
  const {
    partnerId,
    drone_name,
    drone_model,
    drone_type_id,
    mediaUrls, // Added mediaUrls to handle media
  } = req.body;

  try {
    const droneRepo = getRepository(PartnerDroneSchema);
    const droneTypeRepo = getRepository(PartnerDroneTypeSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Check if the drone type exists
    const droneType = await droneTypeRepo.findOne({ where: { id: drone_type_id } });
    if (!droneType) {
      return res.status(404).json({ message: 'Drone type not found' });
    }

    // Create and save the new drone
    const newDrone = droneRepo.create({
      partnerId,
      drone_name,
      drone_model,
      drone_type_id,
    });
    const savedDrone = await droneRepo.save(newDrone);

    // Prepare and save media entries if provided
    if (mediaUrls && mediaUrls.length > 0) {
      const mediaEntries = mediaUrls.map(url => ({
        media_type: 'photo', 
        media_url: url,
        category_type: 'Drone',
        category_id: savedDrone.id, // Assuming savedDrone has an `id` field
      }));
      await mediaRepo.save(mediaEntries);
    }

    res.status(201).json({ message: 'Drone added successfully', drone: savedDrone });
  } catch (error) {
    console.error('Error adding drone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateDrone = async (req, res) => {
  const {
    droneId,
    drone_name,
    drone_model,
    drone_type_id, // Optional: the ID of the drone type
    mediaUrls, // Added mediaUrls to handle media
  } = req.body;

  try {
    const droneRepo = getRepository(PartnerDroneSchema);
    const droneTypeRepo = getRepository(PartnerDroneTypeSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Find the drone to update
    const drone = await droneRepo.findOne({ where: { id: droneId } });
    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    // Update drone type if provided
    if (drone_type_id) {
      const droneType = await droneTypeRepo.findOne({ where: { id: drone_type_id } });
      if (!droneType) {
        return res.status(404).json({ message: 'Drone type not found' });
      }
      drone.drone_type_id = drone_type_id;
    }

    // Update other drone fields
    drone.drone_name = drone_name || drone.drone_name;
    drone.drone_model = drone_model || drone.drone_model;

    // Save updated drone
    const updatedDrone = await droneRepo.save(drone);

    // Handle media URLs if provided
    if (mediaUrls && mediaUrls.length > 0) {
      // Remove old media entries associated with the drone
      await mediaRepo.delete({ category_id: droneId, category_type: 'Drone' });

      // Prepare and save new media entries
      const mediaEntries = mediaUrls.map(url => ({
        media_type: 'photo',
        media_url: url,
        category_type: 'Drone',
        category_id: updatedDrone.id, // Assuming updatedDrone has an `id` field
      }));
      await mediaRepo.save(mediaEntries);
    }

    res.status(200).json({ message: 'Drone updated successfully', drone: updatedDrone });
  } catch (error) {
    console.error('Error updating drone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteDrone = async (req, res) => {
  const { droneId } = req.params;

  try {
    const droneRepo = getRepository(PartnerDroneSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Find the drone to delete
    const drone = await droneRepo.findOne({ where: { id: droneId } });
    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    // Delete associated media entries
    await mediaRepo.delete({ category_id: droneId, category_type: 'Drone' });

    // Remove the drone
    await droneRepo.remove(drone);

    res.status(200).json({ message: 'Drone deleted successfully' });
  } catch (error) {
    console.error('Error deleting drone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllDronesByPartner = async (req, res) => {
  const { partnerId } = req.params;

  try {
    const droneRepo = getRepository(PartnerDroneSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Fetch drones with their types
    const drones = await droneRepo.find({
      where: { partnerId: partnerId },
      relations: ['droneType'], // Assumes 'droneType' relation is set up in PartnerDroneSchema
    });

    if (drones.length === 0) {
      return res.status(404).json({ message: 'No drones found for this partner' });
    }

    // Fetch media for each drone
    const droneIds = drones.map(drone => drone.id);
    const mediaEntries = await mediaRepo.find({
      where: { category_id: In(droneIds), category_type: 'Drone' },
    });

    // Map media entries to respective drones
    const dronesWithMedia = drones.map(drone => ({
      ...drone,
      media: mediaEntries.filter(media => media.category_id === drone.id),
    }));

    res.status(200).json({ drones: dronesWithMedia });
  } catch (error) {
    console.error('Error fetching drones for partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  addDrone,
  getAllDronesByPartner,
  deleteDrone,
  updateDrone,
};
