const addFylingSpotfollow=async(req,res)=>{
    try {
      const {partnerId,spotId}=req.params
    
       
        const connection = await mysql.createConnection(dbConfig);
    
      
        const [result] = await connection.execute(
          'INSERT INTO FlyingSpotFollows (spot_id, user_id) VALUES (?, ?)',
          [spotId, partnerId]
        );
    
       
        connection.end();
    
       
        const follow_id = result.insertId;
    
        res.json({ follow_id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const deleteFylingSpotfollow = async (req, res) => {
  try {
    const { partnerId, spotId } = req.params;

   


    const connection = await mysql.createConnection(dbConfig);

    
    await connection.execute('DELETE FROM FlyingSpotFollows WHERE spot_id = ? AND user_id = ?', [spotId, partnerId]);

    connection.end();

    res.json({ message: 'Flying spot follow deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getFylingSpotfollow=async(req,res)=>{
    
}

module.exports={addFylingSpotfollow,deleteFylingSpotfollow,updateFylingSpotfollow}