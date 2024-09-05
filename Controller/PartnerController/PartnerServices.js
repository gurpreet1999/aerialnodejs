const mysql = require("mysql2/promise");
const pool = require('../../pool');



const AddService = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { service_name, service_description, service_price,service_category, droneMediaUrl } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [mediaResult] = await connection.execute(
        "INSERT INTO partnermedia (user_id, media_type, media_url) VALUES (?, ?, ?)",
        [partnerId, "Image", droneMediaUrl]
      );

      const mediaId = mediaResult.insertId;

      await connection.execute(
        "INSERT INTO myservices (user_id, service_name, service_description,category, service_price, media_id) VALUES (?, ?, ?, ?, ?, ?)",
        [partnerId, service_name, service_description,service_category, service_price, mediaId]
      );

      await connection.commit();

      res.json({ message: "Service added successfully" });
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

const DeleteService = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { serviceId } = req.params;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        "DELETE FROM myservices WHERE service_id = ? AND user_id = ?",
        [serviceId, partnerId]
      );

      await connection.commit();

      res.json({ message: "Service deleted successfully" });
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

const UpdateService = async (req, res) => {
  try {
    const { partnerId } = req.locals;
    const { serviceId } = req.params;
    const { service_name, service_description, service_price, media_url } = req.body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (media_url) {
        await connection.execute(
          "UPDATE partnermedia SET media_url = ? WHERE media_id IN (SELECT media_id FROM myservices WHERE service_id = ? AND user_id = ?)",
          [media_url, serviceId, partnerId]
        );
      }

      await connection.execute(
        "UPDATE myservices SET service_name = ?, service_description = ?, service_price = ? WHERE service_id = ? AND user_id = ?",
        [service_name, service_description, service_price, serviceId, partnerId]
      );

      await connection.commit();

      res.json({ message: "Service updated successfully" });
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

const GetAllServices = async (req, res) => {
  try {
    const { partnerId } = req.locals;

    const connection = await pool.getConnection();

    const [results] = await connection.execute(
      `SELECT
          ms.service_id,
          ms.user_id,
          ms.service_name,
          ms.category,
          ms.service_description,
          ms.service_price,
          pm.media_id,
          pm.media_type,
          pm.media_url
      FROM
          myservices ms
      JOIN
          partnermedia pm ON ms.media_id = pm.media_id
      WHERE
          ms.user_id = ?`,
      [partnerId]
    );

    connection.release();

    res.json({ services: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSpecificService = async (req, res) => {
    try {
      const { partnerId } = req.locals;
      const { serviceId } = req.params;
  
      const connection = await pool.getConnection();
  
      const [results] = await connection.execute(
        `SELECT
            ms.service_id,
            ms.user_id,
            ms.service_name,
            ms.service_description,
            ms.service_price,
            pm.media_id,
            pm.media_type,
            pm.media_url
        FROM
            myservices ms
        JOIN
            partnermedia pm ON ms.media_id = pm.media_id
        WHERE
            ms.user_id = ? AND ms.service_id = ?`,
        [partnerId, serviceId]
      );
  
      connection.release();
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Service not found" });
      }
  
      res.json({ service: results[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

module.exports = { AddService, DeleteService, UpdateService, GetAllServices , GetSpecificService};







// const addService=async(req,res)=>{


//     const partnerId = parseInt(req.params.partnerId, 10); // Retrieve partner ID from URL parameters
//     const {
//       service_title,
//       category,
//       sub_category,
//       service_keyword,
//       service_deliverables,
//       service_media_id,
//       service_media_youtube_link,
//       service_description,
//       service_location,
//       service_faq,
//       verification_status,
//       verification_notes
//     } = req.body;
  
//     try {
//       const partnerRepo = getRepository(PartnerSchema);
//       const serviceRepo = getRepository(PartnerServicesSchema);
  
//       // Fetch the partner entity
//       const partner = await partnerRepo.findOne({where:{ id: partnerId }});
  
//       if (!partner) {
//         return res.status(404).json({ message: 'Partner not found' });
//       }
  
//       // Create a new service entity
//       const newService = serviceRepo.create({
//         partner,
//         service_title,
//         category,
//         sub_category,
//         service_keyword,
//         service_deliverables,
      
//         service_media_id,
//         service_media_youtube_link,
//         service_description,
//         service_location,
//         service_faq,
//         verification_status,
//         verification_notes
//       });
  
//       // Save the new service entity
//       await serviceRepo.save(newService);
  
//       res.status(201).json({ message: 'Service created successfully', service: newService });
//     } catch (error) {
//       console.error('Error creating service:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }

// }


// const addPackage=async(req,res)=>{


//     const { service_id, package_name, price } = req.body; // Extract package details from request body

//     try {
//       // Get repositories for both schemas
//       const serviceRepo = getRepository(PartnerServicesSchema);
//       const packageRepo = getRepository(PartnerServicePackagesSchema);
  
//       // Check if the service exists
//       const service = await serviceRepo.findOne({where:{service_id:service_id}});
//       if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//       }
  
//       // Create a new package
//       const newPackage = packageRepo.create({
//         service: service,  // Linking to the existing service
//         package_name,
//         price,
//       });
  
//       // Save the new package to the database
//       await packageRepo.save(newPackage);
  
//       res.status(201).json({ message: 'Service package created successfully', package: newPackage });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }



// }


// const addfAQ=async(req,res)=>{

//     const { service_id, question, answer } = req.body;
//     try {
//         // Get the FAQ repository
//         const faqRepo = getRepository(PartnerServiceFaqsSchema);
    
//         // Check if the service exists
//         const serviceRepo = getRepository(PartnerServicesSchema);
//         const service = await serviceRepo.findOne({where:{service_id:service_id}});
//         if (!service) {
//           return res.status(404).json({ message: 'Service not found' });
//         }
    
//         // Create a new FAQ
//         const newFaq = faqRepo.create({
//           service: service,  
//           question,
//           answer,
//         });
    
//         // Save the new FAQ
//         await faqRepo.save(newFaq);
    
//         res.status(201).json({ message: 'FAQ created successfully', faq: newFaq });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//       }


// }



// const updateService = async (req, res) => {
//   const serviceId = parseInt(req.params.serviceId, 10); // Retrieve service ID from URL parameters
//   const {
//     service_title,
//     category,
//     sub_category,
//     service_keyword,
//     service_deliverables,
//     service_media_id,
//     service_media_youtube_link,
//     service_description,
//     service_location,
//     service_faq,
//     verification_status,
//     verification_notes
//   } = req.body;

//   try {
//     const serviceRepo = getRepository(PartnerServicesSchema);

//     // Fetch the service entity
//     const service = await serviceRepo.findOne({ where: { id: serviceId } });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     // Update the service attributes
//     service.service_title = service_title || service.service_title;
//     service.category = category || service.category;
//     service.sub_category = sub_category || service.sub_category;
//     service.service_keyword = service_keyword || service.service_keyword;
//     service.service_deliverables = service_deliverables || service.service_deliverables;
//     service.service_media_id = service_media_id || service.service_media_id;
//     service.service_media_youtube_link = service_media_youtube_link || service.service_media_youtube_link;
//     service.service_description = service_description || service.service_description;
//     service.service_location = service_location || service.service_location;
//     service.service_faq = service_faq || service.service_faq;
//     service.verification_status = verification_status || service.verification_status;
//     service.verification_notes = verification_notes || service.verification_notes;

//     // Save the updated service entity
//     await serviceRepo.save(service);

//     res.status(200).json({ message: 'Service updated successfully', service });
//   } catch (error) {
//     console.error('Error updating service:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const deleteService = async (req, res) => {
//   const serviceId = parseInt(req.params.serviceId, 10); // Retrieve service ID from URL parameters

//   try {
//     const serviceRepo = getRepository(PartnerServicesSchema);

//     // Fetch the service entity
//     const service = await serviceRepo.findOne({ where: { id: serviceId } });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     // Delete the service
//     await serviceRepo.remove(service);

//     res.status(200).json({ message: 'Service deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting service:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// const updatePackage = async (req, res) => {
//   const packageId = parseInt(req.params.packageId, 10); // Retrieve package ID from URL parameters
//   const { package_name, price } = req.body;

//   try {
//     const packageRepo = getRepository(PartnerServicePackagesSchema);

//     // Fetch the package entity
//     const package = await packageRepo.findOne({ where: { package_id: packageId } });

//     if (!package) {
//       return res.status(404).json({ message: 'Package not found' });
//     }

//     // Update the package attributes
//     package.package_name = package_name || package.package_name;
//     package.price = price || package.price;

//     // Save the updated package entity
//     await packageRepo.save(package);

//     res.status(200).json({ message: 'Package updated successfully', package });
//   } catch (error) {
//     console.error('Error updating package:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const deletePackage = async (req, res) => {
//   const packageId = parseInt(req.params.packageId, 10); // Retrieve package ID from URL parameters

//   try {
//     const packageRepo = getRepository(PartnerServicePackagesSchema);

//     // Fetch the package entity
//     const package = await packageRepo.findOne({ where: { package_id: packageId } });

//     if (!package) {
//       return res.status(404).json({ message: 'Package not found' });
//     }

//     // Delete the package
//     await packageRepo.remove(package);

//     res.status(200).json({ message: 'Package deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting package:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
