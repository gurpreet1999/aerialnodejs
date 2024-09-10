



const { getRepository } = require('typeorm');

const {PartnerSchema,PartnerServicesSchema,PartnerServicePackagesSchema,PartnerServiceFaqsSchema,PartnerMediaSchema}=require("../../entities/partner/partner.js")




const addService = async (req, res) => {
  const { 
    partnerId, 
    serviceTitle, 
    category, 
    subCategory, 
    serviceDeliverables, 
    serviceMediaYoutubeLink, 
    serviceDescription, 
    serviceLocation, 
    verificationStatus, 
    verificationNotes,
    mediaItems // Array of media items
  } = req.body;

  try {
    const serviceRepo = getRepository(PartnerServicesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema);

    // Create and save the new service
    const newService = serviceRepo.create({
      partner: { id: partnerId }, // Assuming Partner is loaded by its ID
      service_title: serviceTitle,
      category,
      sub_category: subCategory,
      service_deliverables: serviceDeliverables,
      service_media_youtube_link: serviceMediaYoutubeLink,
      service_description: serviceDescription,
      service_location: serviceLocation,
      verification_status: verificationStatus,
      verification_notes: verificationNotes,
    });

    const savedService = await serviceRepo.save(newService);

    // Handle media items if provided
    if (mediaItems && mediaItems.length > 0) {
      const mediaEntries = mediaItems.map(item => ({
        media_type: item.mediaType, // 'photo' or 'video'
        media_url: item.mediaUrl,
        category_type: 'Service',
        category_id: savedService.service_id, // Assuming service_id is the primary key of the service
      }));
      await mediaRepo.save(mediaEntries);
    }

    res.status(201).json({ message: 'Service added successfully', service: savedService });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getServicesByPartner = async (req, res) => {
  const partnerId = parseInt(req.params.partnerId, 10);

  try {
    const serviceRepo = getRepository(PartnerServicesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema);

    // Fetch all services for the given partner
    const services = await serviceRepo.find({
      where: { partner: { id: partnerId } }, // Adjust the field names if different
      relations: ['partner'] // Include related entities if needed
    });

    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found for this partner' });
    }

    // Fetch media for each service
    const serviceIds = services.map(service => service.service_id);
    const media = await mediaRepo.find({
      where: {
        category_type: 'Service',
        category_id: In(serviceIds) // Use the list of service IDs
      }
    });

    // Attach media to each service
    const servicesWithMedia = services.map(service => ({
      ...service,
      media: media.filter(mediaItem => mediaItem.category_id === service.service_id)
    }));

    res.status(200).json(servicesWithMedia);
  } catch (error) {
    console.error('Error fetching services by partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getServiceById = async (req, res) => {
  const serviceId = parseInt(req.params.serviceId, 10);

  try {
    const serviceRepo = getRepository(PartnerServicesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema);

    // Fetch the service by ID
    const service = await serviceRepo.findOne({
      where: { service_id: serviceId }, // Adjust if your schema uses a different field name
      relations: ['partner'] // Include related entities if needed
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Fetch media associated with the service
    const media = await mediaRepo.find({
      where: {
        category_type: 'Service',
        category_id: serviceId // Use the service ID to find related media
      }
    });

    // Attach media to the service
    const serviceWithMedia = {
      ...service,
      media
    };

    res.status(200).json(serviceWithMedia);
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateService = async (req, res) => {
  const serviceId = parseInt(req.params.serviceId, 10);
  const {
    service_title,
    category,
    sub_category,
    service_deliverables,
    service_media_youtube_link,
    service_description,
    service_location,
    verification_status,
    verification_notes,
    mediaItems // Array of media items
  } = req.body;

  try {
    const serviceRepo = getRepository(PartnerServicesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema);

    // Find the existing service
    const service = await serviceRepo.findOne({ where: { service_id: serviceId } });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update service details
    service.service_title = service_title || service.service_title;
    service.category = category || service.category;
    service.sub_category = sub_category || service.sub_category;
    service.service_deliverables = service_deliverables || service.service_deliverables;
    service.service_media_youtube_link = service_media_youtube_link || service.service_media_youtube_link;
    service.service_description = service_description || service.service_description;
    service.service_location = service_location || service.service_location;
    service.verification_status = verification_status || service.verification_status;
    service.verification_notes = verification_notes || service.verification_notes;

    // Save the updated service
    await serviceRepo.save(service);

    // Handle media items if provided
    if (mediaItems && mediaItems.length > 0) {
      // Update or add media items
      const mediaEntries = mediaItems.map(item => ({
        media_type: item.mediaType, // 'photo' or 'video'
        media_url: item.mediaUrl,
        category_type: 'Service',
        category_id: serviceId, // Use the service ID as category_id
      }));
      
      // Clear existing media items for this service
      await mediaRepo.delete({ category_type: 'Service', category_id: serviceId });

      // Save new media items
      await mediaRepo.save(mediaEntries);
    }

    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteService = async (req, res) => {
  const serviceId = parseInt(req.params.serviceId, 10);
  
  try {
    const serviceRepo = getRepository(PartnerServicesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema);

    
    const service = await serviceRepo.findOne({ where: { service_id: serviceId } });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await mediaRepo.delete({ category_type: 'Service', category_id: serviceId });


    await serviceRepo.remove(service);

    res.status(200).json({ message: 'Service and associated media deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};











const addPackage=async(req,res)=>{


    const { service_id, package_name, price } = req.body; 

    try {

      const serviceRepo = getRepository(PartnerServicesSchema);
      const packageRepo = getRepository(PartnerServicePackagesSchema);
  

      const service = await serviceRepo.findOne({where:{service_id:service_id}});
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  

      const newPackage = packageRepo.create({
        service: service,  
        package_name,
        price,
      });
  

      await packageRepo.save(newPackage);
  
      res.status(201).json({ message: 'Service package created successfully', package: newPackage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }



}


const addfAQ=async(req,res)=>{

    const { service_id, question, answer } = req.body;
    try {

        const faqRepo = getRepository(PartnerServiceFaqsSchema);
    
        const serviceRepo = getRepository(PartnerServicesSchema);
        const service = await serviceRepo.findOne({where:{service_id:service_id}});
        if (!service) {
          return res.status(404).json({ message: 'Service not found' });
        }

        const newFaq = faqRepo.create({
          service: service,  
          question,
          answer,
        });

        await faqRepo.save(newFaq);
    
        res.status(201).json({ message: 'FAQ created successfully', faq: newFaq });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }


}










const updatePackage = async (req, res) => {
  const packageId = parseInt(req.params.packageId, 10);
  const { package_name, price } = req.body;

  try {
    const packageRepo = getRepository(PartnerServicePackagesSchema);


    const package = await packageRepo.findOne({ where: { package_id: packageId } });

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }


    package.package_name = package_name || package.package_name;
    package.price = price || package.price;

    
    await packageRepo.save(package);

    res.status(200).json({ message: 'Package updated successfully', package });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deletePackage = async (req, res) => {
  const packageId = parseInt(req.params.packageId, 10);

  try {
    const packageRepo = getRepository(PartnerServicePackagesSchema);

    const package = await packageRepo.findOne({ where: { package_id: packageId } });

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

  
    await packageRepo.remove(package);

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};









module.exports = { addService, deleteService, updateService, updatePackage, deletePackage,addPackage,addfAQ,getServicesByPartner, getServiceById };