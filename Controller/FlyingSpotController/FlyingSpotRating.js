


const updateFlyingSpotRating=async(req,res)=>{
    try {
      const {partnerId,spotId}=req.params
        const {rating_value } = req.body;
    
    
        const connection = await mysql.createConnection(dbConfig);
    
       
        await connection.execute(
          'UPDATE FlyingSpotRatings SET   rating_value = ? WHERE spot_id = ? AND user_id= ?',
          [ rating_value, spotId, partnerId,]
        );
    
       
        connection.end();
    
        res.json({ message: 'Flying spot rating updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      } 
}

const getAllFlyingSpotRating=async(req,res)=>{
    
}


module.exports={addFlyingSpotRating,deleteFlyingSpotRating,updateFlyingSpotRating,getAllFlyingSpotRating}
