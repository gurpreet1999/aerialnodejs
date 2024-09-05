const addFlyingSpotMedia=async(req,res)=>{
    try {

      const {partnerId,spotId}=req.params

        const {  spot_name, spot_latitude, spot_longitude, spot_description } = req.body;
    
      
        const connection = await mysql.createConnection(dbConfig);
    
      
        const [result] = await connection.execute(
          'INSERT INTO FlyingSpots (user_id,spot_id, spot_name, spot_latitude, spot_longitude, spot_description) VALUES (?, ?, ?, ?, ?)',
          [partnerId,spotId, spot_name, spot_latitude, spot_longitude, spot_description]
        );
    
       
        connection.end();
    
      
        const spot_id = result.insertId;
    
        res.json({ spot_id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const deleteFlyingSpotMedia=async(req,res)=>{
    try {
        const {partnerId,spotId}=req.params
    
      
        const connection = await mysql.createConnection(dbConfig);
    
       
        await connection.execute('DELETE FROM FlyingSpots WHERE spot_id = ?', [spotId]);
    
      
        connection.end();
    
        res.json({ message: 'Flying spot deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const updateFlyingSpotMedia=async(req,res)=>{
    try {
      const {partnerId,spotId}=req.params
        const { spot_name, spot_latitude, spot_longitude, spot_description } = req.body;
    
       
        const connection = await mysql.createConnection(dbConfig);
    
     
        await connection.execute(
          'UPDATE FlyingSpots SET user_id = ?, spot_name = ?, spot_latitude = ?, spot_longitude = ?, spot_description = ? WHERE spot_id = ?',
          [partnerId, spot_name, spot_latitude, spot_longitude, spot_description, spotId]
        );
    
      
        connection.end();
    
        res.json({ message: 'Flying spot updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const getAllFlyingSpotMedia=async(req,res)=>{
    
}