


const { getRepository } = require('typeorm');

const {PartnerSchema,PartnerCertificatesSchema}=require("../../entities/partner/partner.js")



const addCertificate = async (req, res) => {
  const { 
    partnerId, 
    certificateTypeId, 
    certificateNumber, 
    certificateExpiry, 
    mediaDocument, // Assuming mediaDocument is a single URL for simplicity; adjust if it should handle multiple URLs
    verificationStatus, 
    verificationNotes 
  } = req.body;

  try {
    const partnerRepo = getRepository(PartnerSchema);
    const certificateRepo = getRepository(PartnerCertificatesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Check if the partner exists
    const partner = await partnerRepo.findOne({ where: { id: partnerId } });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Create and save the new certificate
    const newCertificate = certificateRepo.create({
      partner,
      certificate_type_id: certificateTypeId,
      certificate_number: certificateNumber,
      certificate_expiry: certificateExpiry,
      verification_status: verificationStatus,
      verification_notes: verificationNotes,
    });

    const savedCertificate = await certificateRepo.save(newCertificate);

    // Handle media document if provided
    if (mediaDocument) {
      const mediaEntry = {
        media_type: 'document', 
        media_url: mediaDocument,
        category_type: 'Certificate',
        category_id: savedCertificate.id, // Assuming savedCertificate has an `id` field
      };
      await mediaRepo.save(mediaEntry);
    }

    res.status(201).json({ message: 'Certification added successfully', certification: savedCertificate });
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateCertificate = async (req, res) => {
  const { certificateId } = req.params;
  const { 
    partnerId, 
    certificateTypeId, 
    certificateNumber, 
    certificateExpiry, 
    mediaDocument, // Assuming mediaDocument is a single URL for simplicity
    verificationStatus, 
    verificationNotes 
  } = req.body;

  try {
    const certificateRepo = getRepository(PartnerCertificatesSchema);
    const partnerRepo = getRepository(PartnerSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Find the certificate to update
    const certificate = await certificateRepo.findOne({ where: { id: certificateId } });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Update partner if provided
    if (partnerId) {
      const partner = await partnerRepo.findOne({ where: { id: partnerId } });
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      certificate.partner = partner;
    }

    // Update certificate fields
    certificate.certificate_type_id = certificateTypeId || certificate.certificate_type_id;
    certificate.certificate_number = certificateNumber || certificate.certificate_number;
    certificate.certificate_expiry = certificateExpiry || certificate.certificate_expiry;
    certificate.verification_status = verificationStatus || certificate.verification_status;
    certificate.verification_notes = verificationNotes || certificate.verification_notes;

    // Save updated certificate
    const updatedCertificate = await certificateRepo.save(certificate);

    // Handle media document if provided
    if (mediaDocument) {
      // Remove old media document if it exists
      await mediaRepo.delete({ category_id: certificateId, category_type: 'Certificate' });

      // Create and save new media entry
      const mediaEntry = {
        media_type: 'document',
        media_url: mediaDocument,
        category_type: 'Certificate',
        category_id: updatedCertificate.id, // Assuming updatedCertificate has an `id` field
      };
      await mediaRepo.save(mediaEntry);
    }

    res.status(200).json({ message: 'Certificate updated successfully', certificate: updatedCertificate });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteCertificate = async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificateRepo = getRepository(PartnerCertificatesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Find the certificate to delete
    const certificate = await certificateRepo.findOne({ where: { id: certificateId } });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Remove associated media entries
    await mediaRepo.delete({ category_id: certificateId, category_type: 'Certificate' });

    // Remove the certificate
    await certificateRepo.remove(certificate);

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getCertificatesByPartner = async (req, res) => {
  const { partnerId } = req.params;

  try {
    const certificateRepo = getRepository(PartnerCertificatesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Find certificates for the partner
    const certificates = await certificateRepo.find({
      where: { partnerId: partnerId },
      relations: ['partner'], // Include partner relation if needed
    });

    if (certificates.length === 0) {
      return res.status(404).json({ message: 'No certificates found for this partner' });
    }

    // Fetch associated media for each certificate
    const certificatesWithMedia = await Promise.all(certificates.map(async (certificate) => {
      const media = await mediaRepo.find({
        where: { category_id: certificate.id, category_type: 'Certificate' },
      });
      return { ...certificate, media };
    }));

    res.status(200).json({ message: 'Certificates fetched successfully', certificates: certificatesWithMedia });
  } catch (error) {
    console.error('Error fetching certificates for partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getCertificateById = async (req, res) => {
  const { certificateId } = req.params;

  try {
    const certificateRepo = getRepository(PartnerCertificatesSchema);
    const mediaRepo = getRepository(PartnerMediaSchema); // Added media repository

    // Find the certificate by ID
    const certificate = await certificateRepo.findOne({
      where: { id: certificateId },
      relations: ['partner'], // Include relations if needed
    });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Fetch associated media for the certificate
    const media = await mediaRepo.find({
      where: { category_id: certificateId, category_type: 'Certificate' },
    });

    // Combine certificate with its media
    const certificateWithMedia = {
      ...certificate,
      media,
    };

    res.status(200).json({ message: 'Certificate fetched successfully', certificate: certificateWithMedia });
  } catch (error) {
    console.error('Error fetching certificate:', error);
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
