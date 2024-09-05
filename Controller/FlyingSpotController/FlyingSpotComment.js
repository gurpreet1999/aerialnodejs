const addFlyingSpotComment=async(req,res)=>{
    try {
        
      const {comment_text } = req.body;

      const {partnerId,spotId}=req.params
    
      
        const connection = await mysql.createConnection(dbConfig);
    
      
        const [result] = await connection.execute(
          'INSERT INTO FlyingSpotComments (spot_id, user_id, comment_text) VALUES (?, ?, ?)',
          [spotId, partnerId, comment_text]
        );
    
       
        connection.end();
    
      
        const comment_id = result.insertId;
    
        res.json({ comment_id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const deleteFlyingSpotComment=async(req,res)=>{
    try {
      const {partnerId,spotId}=req.params
    
     
        const connection = await mysql.createConnection(dbConfig);
    
      
        await connection.execute('DELETE FROM FlyingSpotComments WHERE spot_id = ? AND user_id = ?', [spotId, partnerId]);
    
        
        connection.end();
    
        res.json({ message: 'Flying spot comment deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const updateFlyingSpotComment=async(req,res)=>{
  const {partnerId,spotId}=req.params
}

const getAllFlyingSpotComment=async(req,res)=>{
  const {partnerId,spotId}=req.params
}








