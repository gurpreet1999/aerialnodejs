const mysql = require("mysql2/promise");
const pool = require('../../pool');

const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

const AddDrone = async (req, res) => {
  try {
    const { partnerId } = req.locals;

    const { drone_name, drone_model, droneMediaUrl, category } = req.body;

    const connection = await pool.getConnection();

    try {
    const [droneMediaResult] = await connection.execute(
        "INSERT INTO partnermedia (user_id, media_type, media_url) VALUES (?, ?, ?)",
        [partnerId, "Image", droneMediaUrl]
      );

      const droneMediaId = droneMediaResult.insertId;

      const [result] = await connection.execute(
        "INSERT INTO mydrones (user_id, drone_name, drone_model, media_id, category) VALUES (?, ?, ?, ?, ?)",
        [partnerId, drone_name, drone_model, droneMediaId, category]
      );

      const drone_id = result.insertId;

      res.json({ drone_id });
    } catch (error) {
      console.error("Error executing queries:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const DeleteDrone = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const {droneId} = req.params;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

    await connection.execute(
        "DELETE mydrones, partnermedia FROM mydrones LEFT JOIN partnermedia ON mydrones.media_id = partnermedia.media_id WHERE mydrones.drone_id = ? AND mydrones.user_id = ?",
        [droneId, partnerId]
      );

      await connection.commit();

      res.json({ message: "Drone deleted successfully" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const UpdateDrone = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const {droneId} = req.params;

    const { drone_name, drone_model, drone_media_url } = req.body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (drone_media_url) {
        await connection.execute(
          "UPDATE partnermedia SET media_url = ? WHERE media_id IN (SELECT media_id FROM mydrones WHERE drone_id = ? AND user_id = ?)",
          [drone_media_url, droneId, partnerId]
        );
      }

      await connection.execute(
        "UPDATE mydrones SET drone_name = ?, drone_model = ? WHERE drone_id = ? AND user_id = ?",
        [drone_name, drone_model, droneId, partnerId]
      );

      await connection.commit();

      res.json({ message: "Drone updated successfully" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetAllDrones = async (req, res) => {
  try {
    const { partnerId, droneId } = req.locals;
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      `SELECT
          md.drone_id,
          md.user_id,
          md.drone_name,
          md.drone_model,
          md.category,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          mydrones as md
      JOIN
          partnermedia pm ON md.media_id = pm.media_id
      WHERE
          md.user_id = ?;`,
      [partnerId]
    );

    connection.release();

    res.json({ drones: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSpecificDrone = async (req, res) => {
  try {
    const { droneId } = req.params;
    const { partnerId } = req.locals;
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      `SELECT
              md.drone_id,
              md.user_id,
              md.drone_name,
              md.drone_model,
              pm.media_id,
              pm.media_type,
              pm.media_url
          FROM
              mydrones as md
          JOIN
              partnermedia pm ON md.media_id = pm.media_id
          WHERE
              md.user_id = ? AND md.drone_id = ?;`,
      [partnerId, droneId]
    );

    connection.release();

    res.json({ drones: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  AddDrone,
  GetAllDrones,
  GetSpecificDrone,
  DeleteDrone,
  UpdateDrone,
};




// const addDrone = async (req, res) => {
//   const {
//     partnerId,
//     drone_name,
//     drone_model,
//     drone_type_id, 
//   } = req.body;

//   try {
//     const droneRepo = getRepository(PartnerDroneSchema);
//     const droneTypeRepo = getRepository(PartnerDroneTypeSchema);

   
//     const droneType = await droneTypeRepo.findOne({ where: { id: drone_type_id } });
//     if (!droneType) {
//       return res.status(404).json({ message: 'Drone type not found' });
//     }

   
//     const newDrone = droneRepo.create({
//       partnerId,
//       drone_name,
//       drone_model,
//       drone_type_id,  
//     });

    
//     await droneRepo.save(newDrone);

//     res.status(201).json({ message: 'Drone added successfully', drone: newDrone });
//   } catch (error) {
//     console.error('Error adding drone:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const updateDrone = async (req, res) => {
//   const {
//     droneId,
//     drone_name,
//     drone_model,
//     drone_type_id,  // Optional: the ID of the drone type
//   } = req.body;

//   try {
//     const droneRepo = getRepository(PartnerDroneSchema);
//     const droneTypeRepo = getRepository(PartnerDroneTypeSchema);

//     // Fetch the drone entity
//     const drone = await droneRepo.findOne({ where: { id: droneId } });
//     if (!drone) {
//       return res.status(404).json({ message: 'Drone not found' });
//     }

//     // Optionally, check if the provided drone type ID exists
//     if (drone_type_id) {
//       const droneType = await droneTypeRepo.findOne({ where: { id: drone_type_id } });
//       if (!droneType) {
//         return res.status(404).json({ message: 'Drone type not found' });
//       }
//       drone.drone_type_id = drone_type_id;  // Update the drone type
//     }

//     // Update the drone entity with new details
//     drone.drone_name = drone_name || drone.drone_name;
//     drone.drone_model = drone_model || drone.drone_model;

//     // Save the updated drone entity
//     await droneRepo.save(drone);

//     res.status(200).json({ message: 'Drone updated successfully', drone });
//   } catch (error) {
//     console.error('Error updating drone:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const deleteDrone = async (req, res) => {
//   const { droneId } = req.params;  // Retrieve drone ID from URL parameters

//   try {
//     const droneRepo = getRepository(PartnerDroneSchema);

//     // Check if the drone exists
//     const drone = await droneRepo.findOne({ where: { id: droneId } });
//     if (!drone) {
//       return res.status(404).json({ message: 'Drone not found' });
//     }

//     // Delete the drone
//     await droneRepo.remove(drone);

//     res.status(200).json({ message: 'Drone deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting drone:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };




const getAllDronesByPartner = async (req, res) => {
  const { partnerId } = req.params;  // Retrieve partner ID from URL parameters

  try {
    const droneRepo = getRepository(PartnerDroneSchema);

    // Fetch all drones associated with the specified partner ID
    const drones = await droneRepo.find({
      where: { partnerId: partnerId },
      relations: ['droneType'],  // Optional: include droneType relation if needed
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


