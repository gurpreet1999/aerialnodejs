

const { getRepository } = require('typeorm');

const {PartnerDroneSchema,PartnerDroneTypeSchema}=require("../../entities/partner/partner.js")







const addDrone = async (req, res) => {
  const {
    partnerId,
    drone_name,
    drone_model,
    drone_type_id, 
  } = req.body;

  try {
    const droneRepo = getRepository(PartnerDroneSchema);
    const droneTypeRepo = getRepository(PartnerDroneTypeSchema);

   
    const droneType = await droneTypeRepo.findOne({ where: { id: drone_type_id } });
    if (!droneType) {
      return res.status(404).json({ message: 'Drone type not found' });
    }

   
    const newDrone = droneRepo.create({
      partnerId,
      drone_name,
      drone_model,
      drone_type_id,  
    });

    
    await droneRepo.save(newDrone);

    res.status(201).json({ message: 'Drone added successfully', drone: newDrone });
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
    drone_type_id,  // Optional: the ID of the drone type
  } = req.body;

  try {
    const droneRepo = getRepository(PartnerDroneSchema);
    const droneTypeRepo = getRepository(PartnerDroneTypeSchema);

  
    const drone = await droneRepo.findOne({ where: { id: droneId } });
    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

    
    if (drone_type_id) {
      const droneType = await droneTypeRepo.findOne({ where: { id: drone_type_id } });
      if (!droneType) {
        return res.status(404).json({ message: 'Drone type not found' });
      }
      drone.drone_type_id = drone_type_id; 
    }

    drone.drone_name = drone_name || drone.drone_name;
    drone.drone_model = drone_model || drone.drone_model;

    await droneRepo.save(drone);

    res.status(200).json({ message: 'Drone updated successfully', drone });
  } catch (error) {
    console.error('Error updating drone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteDrone = async (req, res) => {
  const { droneId } = req.params;  

  try {
    const droneRepo = getRepository(PartnerDroneSchema);

 
    const drone = await droneRepo.findOne({ where: { id: droneId } });
    if (!drone) {
      return res.status(404).json({ message: 'Drone not found' });
    }

   
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

   
    const drones = await droneRepo.find({
      where: { partnerId: partnerId },
      relations: ['droneType'],  
    });

    if (drones.length === 0) {
      return res.status(404).json({ message: 'No drones found for this partner' });
    }

    res.status(200).json({ drones });
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
