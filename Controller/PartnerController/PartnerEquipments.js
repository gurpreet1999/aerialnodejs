const mysql = require("mysql2/promise");
const pool = require('../../pool');

const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

const AddEquipment = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { equipment_name, equipment_category, equipment_description, droneMediaUrl } =
      req.body;


    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [mediaResult] = await connection.execute(
        "INSERT INTO partnermedia (user_id, media_type, media_url) VALUES (?, ?, ?)",
        [partnerId, "Image", droneMediaUrl]
      );

      const mediaId = mediaResult.insertId;

      await connection.execute(
        "INSERT INTO myequipments (user_id, equipment_name, equipment_description,category, media_id) VALUES (?, ?, ?, ?, ?)",
        [partnerId, equipment_name, equipment_description, equipment_category, mediaId]
      );

      await connection.commit();

      res.json({ message: "Equipment added successfully" });
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

const DeleteEquipment = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { equipmentId } = req.params;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        "DELETE FROM myequipments WHERE equipment_id = ? AND user_id = ?",
        [equipmentId, partnerId]
      );

      await connection.commit();

      res.json({ message: "Equipment deleted successfully" });
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

const UpdateEquipment = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { equipmentId } = req.params;
    const { equipment_name, equipment_description, media_url } = req.body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (media_url) {
        await connection.execute(
          "UPDATE partnermedia SET media_url = ? WHERE media_id IN (SELECT media_id FROM myequipments WHERE equipment_id = ? AND user_id = ?)",
          [media_url, equipmentId, partnerId]
        );
      }

      await connection.execute(
        "UPDATE myequipments SET equipment_name = ?, equipment_description = ? WHERE equipment_id = ? AND user_id = ?",
        [equipment_name, equipment_description, equipmentId, partnerId]
      );

      await connection.commit();

      res.json({ message: "Equipment updated successfully" });
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

const GetAllEquipment = async (req, res) => {
  try {
    const { partnerId } = req.locals;

    const connection = await pool.getConnection();

    const [results] = await connection.execute(
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
      [partnerId]
    );

    connection.release();

    res.json({ equipments: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSpecificEquipment = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { equipmentId } = req.params;

    const connection = await pool.getConnection();

    const [results] = await connection.execute(
      `SELECT
            me.equipment_id,
            me.user_id,
            me.equipment_name,
            me.equipment_description,
            pm.media_id,
            pm.media_type,
            pm.media_url
        FROM
            myequipments me
        JOIN
            partnermedia pm ON me.media_id = pm.media_id
        WHERE
            me.user_id = ? AND me.equipment_id = ?`,
      [partnerId, equipmentId]
    );

    connection.release();

    if (results.length === 0) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    res.json({ equipment: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  AddEquipment,
  DeleteEquipment,
  UpdateEquipment,
  GetAllEquipment,
  GetSpecificEquipment,
};




// const createEquipment=async(req,res)=>{

//   const equipmentRepository = getRepository(PartnerEquipmentsSchema);
//   const mediaRepository = getRepository(PartnerMediaSchema);



//   const {
//     partnerId,
//     equipmentTypeId,
//     equipmentName,
//     equipmentModel,
//     equipmentStatus,
//     equipmentDescription,
//     verificationStatus,
//     verificationNotes,
//     mediaUrls,
//   } = req.body;




//   const equipment = equipmentRepository.create({
//     user_id: partnerId,  
//     equipment_type_id: equipmentTypeId,  
//     equipment_name: equipmentName,  
//     equipment_model: equipmentModel, 
//     equipment_status: equipmentStatus, 
//     equipment_description: equipmentDescription, 
//     verification_status: verificationStatus, 
//     verification_notes: verificationNotes,  
//   });

//   const savedEquipment = await equipmentRepository.save(equipment);

//   // Get the equipment ID
//   const equipmentId = savedEquipment.equipment_id;

//   // Prepare media entries
//   const mediaEntries = mediaUrls.map(url => ({
//     media_type: 'photo', 
//     media_url: url,
//     category_type: 'Equipment',
//     category_id: equipmentId,
//   }));

//   // Create and save all media entries
//   await mediaRepository.save(mediaEntries);

//   return savedEquipment;  // Return the saved equipment if needed

// }


// const updateEquipment = async (req, res) => {
//   const { equipmentId } = req.params;
//   const {
//     partnerId,
//     equipmentTypeId,
//     equipmentName,
//     equipmentModel,
//     equipmentStatus,
//     equipmentDescription,
//     verificationStatus,
//     verificationNotes,
//     mediaUrls, 
//   } = req.body;

//   try {
//     const equipmentRepository = getRepository(PartnerEquipmentsSchema);
//     const mediaRepository = getRepository(PartnerMediaSchema);

   
//     const equipment = await equipmentRepository.findOne({ where: { equipment_id: equipmentId } });
//     if (!equipment) {
//       return res.status(404).json({ message: 'Equipment not found' });
//     }

   
//     equipment.user_id = partnerId || equipment.user_id;
//     equipment.equipment_type_id = equipmentTypeId || equipment.equipment_type_id;
//     equipment.equipment_name = equipmentName || equipment.equipment_name;
//     equipment.equipment_model = equipmentModel || equipment.equipment_model;
//     equipment.equipment_status = equipmentStatus || equipment.equipment_status;
//     equipment.equipment_description = equipmentDescription || equipment.equipment_description;
//     equipment.verification_status = verificationStatus || equipment.verification_status;
//     equipment.verification_notes = verificationNotes || equipment.verification_notes;

 
//     const updatedEquipment = await equipmentRepository.save(equipment);

 
//     if (mediaUrls && mediaUrls.length > 0) {

//       await mediaRepository.delete({ category_id: equipmentId, category_type: 'Equipment' });

    
//       const mediaEntries = mediaUrls.map((url) => ({
//         media_type: 'photo', 
//         media_url: url,
//         category_type: 'Equipment',
//         category_id: equipmentId,
//       }));

//       await mediaRepository.save(mediaEntries);
//     }

//     res.status(200).json({ message: 'Equipment updated successfully', equipment: updatedEquipment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };




// const deleteEquipment = async (req, res) => {
//   const { equipmentId } = req.params;

//   try {
//     const equipmentRepository = getRepository(PartnerEquipmentsSchema);
//     const mediaRepository = getRepository(PartnerMediaSchema);

//     // Find the equipment by ID
//     const equipment = await equipmentRepository.findOne({ where: { equipment_id: equipmentId } });
//     if (!equipment) {
//       return res.status(404).json({ message: 'Equipment not found' });
//     }

//     // Delete related media entries
//     await mediaRepository.delete({ category_id: equipmentId, category_type: 'Equipment' });

//     // Delete the equipment
//     await equipmentRepository.remove(equipment);

//     res.status(200).json({ message: 'Equipment deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// const getEquipmentById = async (req, res) => {
//   const { equipmentId } = req.params;

//   try {
//     const equipmentRepository = getRepository(PartnerEquipmentsSchema);
//     const mediaRepository = getRepository(PartnerMediaSchema);

//     // Find the equipment by ID
//     const equipment = await equipmentRepository.findOne({ where: { equipment_id: equipmentId } });
//     if (!equipment) {
//       return res.status(404).json({ message: 'Equipment not found' });
//     }

//     // Get related media for the equipment
//     const media = await mediaRepository.find({ where: { category_id: equipmentId, category_type: 'Equipment' } });

//     res.status(200).json({
//       message: 'Equipment fetched successfully',
//       equipment,
//       media, // Include media related to the equipment
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };




// const getAllEquipmentOfPartner = async (req, res) => {
//   const { partnerId } = req.params;

//   try {
//     const equipmentRepository = getRepository(PartnerEquipmentsSchema);
//     const mediaRepository = getRepository(PartnerMediaSchema);

 
//     const equipment = await equipmentRepository.find({
//       where: { user_id: partnerId }, // Assuming 'user_id' references the partner
//     });

//     if (!equipment || equipment.length === 0) {
//       return res.status(404).json({ message: 'No equipment found for this partner' });
//     }

   
//     const equipmentWithMedia = await Promise.all(
//       equipment.map(async (item) => {
//         const media = await mediaRepository.find({
//           where: { category_id: item.equipment_id, category_type: 'Equipment' },
//         });

//         return {
//           ...item,
//           media, 
//         };
//       })
//     );

//     res.status(200).json({
//       message: 'Equipment fetched successfully',
//       equipment: equipmentWithMedia, 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
