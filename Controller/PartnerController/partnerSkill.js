const mysql = require("mysql2/promise");
const pool = require('../../pool');





const getDefaultSkills = async (req,res) => {
  try {
    // Create a connection to the database
    const connection = await pool.getConnection();
    
    // Query to fetch all default skills
    const [results] = await connection.execute("SELECT skill_id, skill_name FROM skills");
    
    // Close the database connection
    connection.release();

    // Return the default skills
    res.status(200).json(results)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const UpdatePartnerSkill = async (req, res) => {
  try {
    const { skills } = req.body;
    const { partnerId } = req.locals;

    const connection = await pool.getConnection();

    // Begin a transaction
    await connection.beginTransaction();

    try {
      // Delete existing skills for the partner
      await connection.execute(
        "DELETE FROM partnerskills WHERE user_id = ?",
        [partnerId]
      );

      // Insert new skills
      for (const skillId of skills) {
        await connection.execute(
          "INSERT INTO partnerskills (user_id, skill_id) VALUES (?, ?)",
          [partnerId, skillId]
        );
      }

      // Commit the transaction
      await connection.commit();

      res.json({ message: "Partner skills updated successfully" });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await connection.rollback();
      console.error("Error updating partner skills:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      // Close the connection
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const GetAllSkillsForUser = async (req, res) => {
  try {
    const {partnerId}=req.locals;

    // Create a connection to the database
    const connection = await pool.getConnection();

    // Execute the SQL query
    const [results] = await connection.execute(
      `SELECT
          ps.user_id,
          s.skill_id,
          s.skill_name
      FROM
          partnerskills ps
      JOIN
          skills s ON ps.skill_id = s.skill_id
      WHERE
          ps.user_id = ?;`,
      [partnerId]
    );

    // Close the database connection
    connection.release();

    res.json({ skills: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {getDefaultSkills, UpdatePartnerSkill, GetAllSkillsForUser};








// const addOrUpdateSkillsForPartner = async (req, res) => {
//   const partnerId = parseInt(req.params.partnerId, 10); 
//   const { skillIds } = req.body; // Expecting an array of skill IDs

//   try {
   
//     if (!Array.isArray(skillIds) || skillIds.some(id => isNaN(id))) {
//       return res.status(400).json({ message: 'Invalid skill IDs' });
//     }

//     const partnerRepo = getRepository(PartnerSchema);
//     const skillRepo = getRepository(SkillsSchema);

   
//     const partner = await partnerRepo.findOne({
//       where: { id: partnerId },
//       relations: ['skills'], // Ensure skills relation is loaded
//     });

//     if (!partner) {
//       return res.status(404).json({ message: 'Partner not found' });
//     }

   
//     const skills = await skillRepo.findByIds(skillIds);

   
//     if (skills.length !== skillIds.length) {
//       return res.status(404).json({ message: 'Some skills not found' });
//     }

  
//     partner.skills = skills;

    
//     await partnerRepo.save(partner);

//     res.status(200).json({ message: 'Skills updated successfully', partner });
//   } catch (error) {
//     console.error('Error adding/updating skills:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const getAllSkillsOfPartner = async (req, res) => {
//   const partnerId = parseInt(req.params.partnerId, 10); 

//   try {
//     const partnerRepo = getRepository(PartnerSchema);

//     // Fetch the partner entity including skills
//     const partner = await partnerRepo.findOne({
//       where: { id: partnerId },
//       relations: ['skills'], // Ensure skills relation is loaded
//     });

//     if (!partner) {
//       return res.status(404).json({ message: 'Partner not found' });
//     }

//     // Extract skills from the partner
//     const skills = partner.skills;

//     res.status(200).json({ message: 'Skills retrieved successfully', skills });
//   } catch (error) {
//     console.error('Error retrieving partner skills:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
