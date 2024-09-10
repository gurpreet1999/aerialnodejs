const mysql = require("mysql2/promise");
const pool = require('../../pool');

const dbConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
};

const AddShowreel = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { showreel_description,showreel_name,showreel_category, showreel_price, droneMediaUrl } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [mediaResult] = await connection.execute(
        "INSERT INTO partnermedia (user_id, media_type, media_url) VALUES (?, ?, ?)",
        [partnerId, "Image", droneMediaUrl]
      );

      const mediaId = mediaResult.insertId;

      await connection.execute(
        "INSERT INTO myshowreel (user_id,showreel_title, showreel_description, showreel_price, media_id) VALUES (?, ?, ?, ?, ?)",
        [partnerId,showreel_name, showreel_description, showreel_price, mediaId]
      );

      await connection.commit();

      res.json({ message: "Showreel added successfully" });
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

const DeleteShowreel = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { showreelId } = req.params;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute("DELETE FROM myshowreel WHERE user_id = ? AND showreel_id = ?", [
        partnerId,
        showreelId
      ]);

      await connection.commit();

      res.json({ message: "Showreel deleted successfully" });
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


const UpdateShowreel = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { showreelId } = req.params;
    const { showreel_description, showreel_price, media_url } = req.body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (media_url) {
        await connection.execute(
          "UPDATE partnermedia SET media_url = ? WHERE media_id IN (SELECT media_id FROM myshowreel WHERE user_id = ? AND showreel_id = ?)",
          [media_url, partnerId, showreelId]
        );
      }

      await connection.execute(
        "UPDATE myshowreel SET showreel_description = ?, showreel_price = ? WHERE user_id = ? AND showreel_id = ?",
        [showreel_description, showreel_price, partnerId, showreelId]
      );

      await connection.commit();

      res.json({ message: "Showreel updated successfully" });
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

const GetAllShowreels = async (req, res) => {
  try {
    const { partnerId } = req.locals;

    const connection = await pool.getConnection();

    const [results] = await connection.execute(
      `SELECT
          ms.showreel_id,
          ms.user_id,
          ms.showreel_title,
          ms.showreel_description,
          ms.showreel_price,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          myshowreel ms
      JOIN
          partnermedia pm ON ms.media_id = pm.media_id
      WHERE
          ms.user_id = ?`,
      [partnerId]
    );

    connection.release();

    res.json({ showreels: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSpecificShowreel = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { showreelId } = req.params;

    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      `SELECT
          ms.showreel_id,
          ms.user_id,
          ms.showreel_description,
          ms.showreel_price,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          myshowreel ms
      JOIN
          partnermedia pm ON ms.media_id = pm.media_id
      WHERE
          ms.user_id = ? AND ms.showreel_id = ?`,
      [partnerId, showreelId]
    );

    connection.release();

    if (result.length === 0) {
      return res.status(404).json({ error: "Showreel not found" });
    }

    res.json({ showreel: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




const addShowreel = async (req, res) => {
  const { partnerId } = req.params; 
  const {
    showreel_name,
    showreel_description,
    youtube_video_link,
    keyword,
    category,
  } = req.body; 

  try {
    const partnerRepo = getRepository(Partner);
    const showreelRepo = getRepository(PartnerShowreel);

   
    const partner = await partnerRepo.findOne({ where: { id: partnerId } });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

   
    const newShowreel = showreelRepo.create({
      partner,
      showreel_name,
      showreel_description,
      youtube_video_link,
      keyword,
      category,
    });

   
    await showreelRepo.save(newShowreel);

    res.status(201).json({ message: 'Showreel added successfully', showreel: newShowreel });
  } catch (error) {
    console.error('Error adding showreel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateShowreel = async (req, res) => {
  const { showreelId } = req.params;
  const {
    showreel_name,
    showreel_description,
    youtube_video_link,
    keyword,
    category,
  } = req.body; 

  try {
    const showreelRepo = getRepository(PartnerShowreel);

  
    const showreel = await showreelRepo.findOne({ where: { id: showreelId } });
    if (!showreel) {
      return res.status(404).json({ message: 'Showreel not found' });
    }

  
    showreel.showreel_name = showreel_name || showreel.showreel_name;
    showreel.showreel_description = showreel_description || showreel.showreel_description;
    showreel.youtube_video_link = youtube_video_link || showreel.youtube_video_link;
    showreel.keyword = keyword || showreel.keyword;
    showreel.category = category || showreel.category;

  
    await showreelRepo.save(showreel);

    res.status(200).json({ message: 'Showreel updated successfully', showreel });
  } catch (error) {
    console.error('Error updating showreel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteShowreel = async (req, res) => {
  const { showreelId } = req.params;

  try {
    const showreelRepo = getRepository(PartnerShowreel);


    
    const showreel = await showreelRepo.findOne({ where: { id: showreelId } });
    if (!showreel) {
      return res.status(404).json({ message: 'Showreel not found' });
    }

  
    await showreelRepo.remove(showreel);

    res.status(200).json({ message: 'Showreel deleted successfully' });
  } catch (error) {
    console.error('Error deleting showreel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  addShowreel,
  deleteShowreel ,
  updateShowreel

};
