const mysql = require("mysql2/promise");
const pool = require('../../pool');

const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

const addPartnerExperience = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { title, description,company,employmentType, location,currentlyWorking,  startDate, endDate, expMediaUrl } = req.body;

    const connection = await pool.getConnection();
    const [partnerExperience] = await connection.execute(
      "INSERT INTO partnermedia (user_id, media_type, media_url) VALUES (?, ?, ?)",
      [partnerId, "Image", expMediaUrl]
    );

    const expMediaId = partnerExperience.insertId;

    const [result] = await connection.execute(
      "INSERT INTO myexperience (user_id, exp_title, exp_desc,company_name,employment_type,location, exp_st, exp_et, media_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [partnerId, title, description,company,employmentType,location,startDate, endDate, expMediaId]
    );

    const experienceId = result.insertId;

    connection.end();
    res.status(200).json({ experienceId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { experienceId } = req.params;

    const connection = await pool.getConnection();
    await connection.execute(
      "DELETE FROM myexperience WHERE user_id = ? AND exp_id = ?",
      [partnerId, experienceId]
    );

    connection.end();
    res.json({ message: "Drone experience deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { experienceId } = req.params;
    const { title, description, startDate, endDate, expMediaUrl } = req.body;

    const connection = await pool.getConnection();

    if (expMediaUrl) {
      await connection.execute(
        "UPDATE partnermedia SET media_url = ? WHERE media_id IN (SELECT media_id FROM myexperience WHERE exp_id = ? AND user_id = ?)",
        [expMediaUrl, experienceId, partnerId]
      );
    }
    await connection.execute(
      "UPDATE myexperience SET exp_title = ?, exp_desc = ?, exp_st = ?, exp_et = ? WHERE exp_id = ? AND user_id = ?",
      [title, description, startDate, endDate, experienceId, partnerId]
    );

    connection.end();
    res.json({ message: "Drone experience updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const showExperience = async (req, res) => {
  try {
    const { partnerId } = req.locals;

    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      `SELECT
          me.exp_id,
          me.user_id,
          me.exp_title,
          me.exp_desc,
          me.company_name,
          me.employment_type,
          me.location,
          me.exp_st,
          me.exp_et,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          myexperience me
      JOIN
          partnermedia pm ON me.media_id = pm.media_id
      WHERE
          me.user_id = ?`,
      [partnerId]
    );

    connection.end();
    res.json({ droneExperiences: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const viewSpecificExperience = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { experienceId } = req.params;

    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      `SELECT * FROM myexperience WHERE user_id = ? AND exp_id = ?`,
      [partnerId, experienceId]
    );

    connection.end();
    if (results.length === 0) {
      return res.status(404).json({ error: "Drone experience not found" });
    }
    res.json({ droneExperience: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  showExperience,
  viewSpecificExperience,
  addPartnerExperience,
  updateExperience,
  deleteExperience,
};






