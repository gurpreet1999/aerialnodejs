const mysql = require("mysql2/promise");
const pool = require('../../pool');

const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

const UpdatePartnerRole = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { new_role_name } = req.body;
    // Check if the new role name is a valid ENUM value
    const isValidRole = [
      "Drone Owner",
      "Drone Service Provider",
      "Drone Pilot",
      "Drone Engineer",
      "Professional Photographer",
      "Drone Mechanic",
    ].includes(new_role_name);
    if (!isValidRole) {
      return res.status(400).json({ error: "Invalid role name" });
    }

    const connection = await pool.getConnection();

    // Update partner role
    await connection.execute(
      "UPDATE partners SET partner_role = ? WHERE user_id = ?",
      [new_role_name, partnerId]
    );

    // Fetch updated partner details
    const [updatedUser] = await connection.execute(
      "SELECT * FROM partners WHERE user_id = ?",
      [partnerId]
    );

    connection.release();

    // Send the updated user data
    res.status(200).send("Role Updated Successfully!")
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { UpdatePartnerRole };



// const addOrUpdateRole = async (req, res) => {
//   try {
//     const partnerId = parseInt(req.params.partnerId, 10); 
//     const roleIds = req.body.roleIds;

//     // Validate that roleIds is an array and contains valid numbers
//     if (!Array.isArray(roleIds) || roleIds.some(id => isNaN(id))) {
//       return res.status(400).json({ message: 'Invalid role IDs' });
//     }

//     const partnerRepo = getRepository(PartnerSchema);
//     const roleRepo = getRepository(PartnerRolesListSchema);
    
//     // Fetch the partner entity
//     const partner = await partnerRepo.findOne({
//       where: { id: partnerId },
//       relations: ['roles'], // Ensure roles relation is loaded
//     });

//     if (!partner) {
//       return res.status(404).json({ message: 'Partner not found' });
//     }

//     // Fetch the roles to be assigned to the partner
//     const roles = await roleRepo.findByIds(roleIds);

//     if (!roles.length) {
//       return res.status(404).json({ message: 'No valid roles found' });
//     }

//     // Add/Update the partner's roles (this will replace the old roles if they exist)
//     partner.roles = roles;

//     // Save the updated partner entity
//     await partnerRepo.save(partner);

//     res.status(200).json({ message: 'Roles updated successfully', partner });
//   } catch (error) {
//     console.error('Error adding/updating roles:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
