const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand,PutObjectCommand } = require("@aws-sdk/client-s3");


const clientParams = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY,
  },
  region: process.env.AWS_REGION,
};



const s3Client = new S3Client(clientParams);

const uploadPreSignedUrl=async(req,res)=>{
 try {
        const { filename, contenttype } = req.body;
    
        const putObjectCommand = new PutObjectCommand({
          Bucket:process.env.BUCKET_NAME,
          Key: `/uploads/${filename}`,
          ContentType: contenttype,
        });
    
        const url = await getSignedUrl(s3Client, putObjectCommand);
        res.json({ uploadUrl: url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


const viewObjectPresignedUrl=async(req,res)=>{

    try {
        const { key } = req.params;
        const getObjectCommand = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: `/uploads/${key}`,
        });
    
        const url = await getSignedUrl(s3Client, getObjectCommand);
        res.json({ downloadUrl: url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

}

module.exports={uploadPreSignedUrl,viewObjectPresignedUrl}