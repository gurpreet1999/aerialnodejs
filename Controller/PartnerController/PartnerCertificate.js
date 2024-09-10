


const { getRepository } = require('typeorm');

const {PartnerSchema,PartnerCertificatesSchema}=require("../../entities/partner/partner.js")



const addCertificate=async(req,res)=>{
  const { partnerId, certificateTypeId, certificateNumber, certificateExpiry, mediaDocument, verificationStatus, verificationNotes } = req.body;
  try {
  const partnerRepo = getRepository(PartnerSchema);
  const certificateRepo = getRepository(PartnerCertificatesSchema);


  const partner = await partnerRepo.findOne({ where: { id: partnerId } });
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }



  const newCertificate = certificateRepo.create({
    partner,
    certificate_type_id: certificateTypeId,
    certificate_number: certificateNumber,
    certificate_expiry: certificateExpiry,
    media_document: mediaDocument,
    verification_status: verificationStatus,
    verification_notes: verificationNotes,
  });


  await certificateRepo.save(newCertificate);

  res.status(201).json({ message: 'Certification added successfully', certification: newCertificate });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}




}

const updateCertificate = async (req, res) => {
  const { certificateId } = req.params;
  const { partnerId, certificateTypeId, certificateNumber, certificateExpiry, mediaDocument, verificationStatus, verificationNotes } = req.body;

  try {
    const certificateRepo = getRepository(PartnerCertificatesSchema);
    const partnerRepo = getRepository(PartnerSchema);


    const certificate = await certificateRepo.findOne({ where: { id: certificateId } });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }


    if (partnerId) {
      const partner = await partnerRepo.findOne({ where: { id: partnerId } });
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      certificate.partner = partner;
    }

    certificate.certificate_type_id = certificateTypeId || certificate.certificate_type_id;
    certificate.certificate_number = certificateNumber || certificate.certificate_number;
    certificate.certificate_expiry = certificateExpiry || certificate.certificate_expiry;
    certificate.media_document = mediaDocument || certificate.media_document;
    certificate.verification_status = verificationStatus || certificate.verification_status;
    certificate.verification_notes = verificationNotes || certificate.verification_notes;


    await certificateRepo.save(certificate);

    res.status(200).json({ message: 'Certificate updated successfully', certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





const deleteCertificate = async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificateRepo = getRepository(PartnerCertificatesSchema);

  
    const certificate = await certificateRepo.findOne({ where: { id: certificateId } });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    
    await certificateRepo.remove(certificate);

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getCertificatesByPartner = async (req, res) => {
  const { partnerId } = req.params;

  try {
    const partnerRepo = getRepository(PartnerSchema);
    const certificateRepo = getRepository(PartnerCertificatesSchema);

    
  

    
    const certificates = await certificateRepo.find({
      where: { partnerId: partnerId },
     
    });

    res.status(200).json({ message: 'Certificates fetched successfully', certificates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getCertificateById = async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificateRepo = getRepository(PartnerCertificatesSchema);

  
    const certificate = await certificateRepo.findOne({ where: { id: certificateId }, });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json({ message: 'Certificate fetched successfully', certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};












module.exports = {
  addCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificatesByPartner,
  getCertificateById
};
