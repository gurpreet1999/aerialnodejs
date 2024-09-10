



const { getRepository } = require('typeorm');

const {PartnerSchema,PartnerServicesSchema,PartnerServicePackagesSchema,PartnerServiceFaqsSchema}=require("../../entities/partner/partner.js")







const addService=async(req,res)=>{


    const partnerId = parseInt(req.params.partnerId, 10); 
    const {
      service_title,
      category,
      sub_category,
      service_keyword,
      service_deliverables,
      service_media_id,
      service_media_youtube_link,
      service_description,
      service_location,
      service_faq,
      verification_status,
      verification_notes
    } = req.body;
  
    try {
      const partnerRepo = getRepository(PartnerSchema);
      const serviceRepo = getRepository(PartnerServicesSchema);
  
    
      const partner = await partnerRepo.findOne({where:{ id: partnerId }});
  
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
  
    
      const newService = serviceRepo.create({
        partner,
        service_title,
        category,
        sub_category,
        service_keyword,
        service_deliverables,
      
        service_media_id,
        service_media_youtube_link,
        service_description,
        service_location,
        service_faq,
        verification_status,
        verification_notes
      });
  
 
      await serviceRepo.save(newService);
  
      res.status(201).json({ message: 'Service created successfully', service: newService });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

}


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



const updateService = async (req, res) => {
  const serviceId = parseInt(req.params.serviceId, 10); 
  const {
    service_title,
    category,
    sub_category,
    service_keyword,
    service_deliverables,
    service_media_id,
    service_media_youtube_link,
    service_description,
    service_location,
    service_faq,
    verification_status,
    verification_notes
  } = req.body;

  try {
    const serviceRepo = getRepository(PartnerServicesSchema);


    const service = await serviceRepo.findOne({ where: { id: serviceId } });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }


    service.service_title = service_title || service.service_title;
    service.category = category || service.category;
    service.sub_category = sub_category || service.sub_category;
    service.service_keyword = service_keyword || service.service_keyword;
    service.service_deliverables = service_deliverables || service.service_deliverables;
    service.service_media_id = service_media_id || service.service_media_id;
    service.service_media_youtube_link = service_media_youtube_link || service.service_media_youtube_link;
    service.service_description = service_description || service.service_description;
    service.service_location = service_location || service.service_location;
    service.service_faq = service_faq || service.service_faq;
    service.verification_status = verification_status || service.verification_status;
    service.verification_notes = verification_notes || service.verification_notes;


    await serviceRepo.save(service);

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


    const service = await serviceRepo.findOne({ where: { id: serviceId } });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await serviceRepo.remove(service);

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



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






module.exports = { addService, deleteService, updateService, updatePackage, deletePackage,addPackage,addfAQ};