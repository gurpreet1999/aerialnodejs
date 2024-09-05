const addFlyingSpotLike=async(req,res)=>{
  
    try {
      const {partnerId,spotId}=req.params
    
     
        const connection = await mysql.createConnection(dbConfig);
    
      
        const [result] = await connection.execute(
          'INSERT INTO FlyingSpotLikes (spot_id, user_id) VALUES (?, ?)',
          [spotId, partnerId]
        );
        const createTriggerQuery = `
        CREATE TRIGGER update_counters_after_like
        AFTER INSERT ON Likes
        FOR EACH ROW
        BEGIN
            UPDATE FlyingSpots
            SET total_likes = total_likes + 1
            WHERE spot_id = NEW.spot_id;
        END;
        `;
        await connection.query(createTriggerQuery);
     
        connection.end();
    
       
        const like_id = result.insertId;
    
        res.json({ like_id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const deleteFlyingSpotLike=async(req,res)=>{
    try {
      const {partnerId,spotId}=req.params
    
      
        const connection = await mysql.createConnection(dbConfig);
    
      
        await connection.execute('DELETE FROM FlyingSpotLikes WHERE spot_id = ? AND user_id = ?', [spotId, partnerId]);
    
       
        connection.end();
    
        res.json({ message: 'Flying spot like deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}


module.exports={addFlyingSpotLike,deleteFlyingSpotLike}