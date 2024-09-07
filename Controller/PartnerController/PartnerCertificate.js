

//add partner certificate


// const AddCertificate = async (req, res) => {
//   try {
//     const { certificate_name, certificate_issued_by, droneMediaUrl } = req.body;

//     const { partnerId } = req.locals;

//     const connection = await pool.getConnection();

//     try {
//       const [mediaResult] = await connection.execute(
//         "INSERT INTO partnermedia (user_id, media_type, media_url) VALUES (?, ?, ?)",
//         [partnerId, "Image", droneMediaUrl]
//       );

//       const mediaId = mediaResult.insertId;

//       const [result] = await connection.execute(
//         "INSERT INTO mycertificates (user_id, certificate_name, certificate_issued_by, media_id) VALUES (?, ?, ?, ?)",
//         [partnerId, certificate_name, certificate_issued_by, mediaId]
//       );

//       const certificate_id = result.insertId;

//       res.json({ certificate_id });
//     } catch (error) {
//       console.error("Error executing queries:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     } finally {
//       await connection.release();
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

//delete partner certificate

// const DeleteCertificate = async (req, res) => {
//   try {
//     const { partnerId } = req.locals;
//     const {certificateId} = req.params;

//     const connection = await pool.getConnection();

//     try {
//       await connection.beginTransaction();

//       await connection.execute(
//         "DELETE mycertificates, partnermedia FROM mycertificates LEFT JOIN partnermedia ON mycertificates.media_id = partnermedia.media_id WHERE mycertificates.certificate_id = ?",
//         [certificateId]
//       );

//       await connection.commit();

//       res.json({ message: "Certificate deleted successfully" });
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

//update partner certifcate

// const UpdateCertificate = async (req, res) => {
//   try {
//     const { partnerId } = req.locals;
//     const {certificateId} = req.params;
//     const { certificate_name, certificate_issued_by, media_url } = req.body;

//     const connection = await pool.getConnection();

//     try {
//       await connection.beginTransaction();

//       if (media_url) {
//         await connection.execute(
//           "UPDATE partnermedia SET media_url = ? WHERE media_id IN (SELECT media_id FROM mycertificates WHERE certificate_id = ?)",
//           [media_url, certificateId]
//         );
//       }

//       await connection.execute(
//         "UPDATE mycertificates SET certificate_name = ?, certificate_issued_by = ? WHERE certificate_id = ?",
//         [certificate_name, certificate_issued_by, certificateId]
//       );

//       await connection.commit();

//       res.json({ message: "Certificate updated successfully" });
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

//get all partner certificate

// const GetAllCertificates = async (req, res) => {
//   try {
//     const { partnerId } = req.locals;

//     const connection = await pool.getConnection();

//     const [results] = await connection.execute(
//       `SELECT
//           mc.certificate_id,
//           mc.user_id,
//           mc.certificate_name,
//           mc.certificate_issued_by,
//           pm.media_id,
//           pm.media_type,
//           pm.media_url
//       FROM
//           mycertificates mc
//       JOIN
//           partnermedia pm ON mc.media_id = pm.media_id
//       WHERE
//           mc.user_id = ?;`,
//       [partnerId]
//     );

//     connection.release();

//     res.json({ certificates: results });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const GetSpecificCertificate = async (req, res) => {
//   try {
//     const { partnerId } = req.locals;
//     const { certificateId } = req.params;

//     const connection = await pool.getConnection();
    
//     const [results] = await connection.execute(
//       `SELECT
//           mc.certificate_id,
//           mc.user_id,
//           mc.certificate_name,
//           mc.certificate_issued_by,
//           pm.media_id,
//           pm.media_type,
//           pm.media_url
//       FROM
//           mycertificates mc
//       JOIN
//           partnermedia pm ON mc.media_id = pm.media_id
//       WHERE
//           mc.user_id = ? AND mc.certificate_id = ?`,
//       [partnerId, certificateId]
//     );

//     connection.release();
    
//     if (results.length === 0) {
//       return res.status(404).json({ error: "Certificate not found" });
//     }

//     res.json({ certificate: results[0] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };











const addCertificate=async(req,res)=>{
  const { partnerId, certificateTypeId, certificateNumber, certificateExpiry, mediaDocument, verificationStatus, verificationNotes } = req.body;
  try {
  const partnerRepo = getRepository(PartnerSchema);
  const certificateRepo = getRepository(PartnerCertificatesSchema);

  // Check if partner exists
  const partner = await partnerRepo.findOne({ where: { id: partnerId } });
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }


  // Create a new certification
  const newCertificate = certificateRepo.create({
    partner,
    certificate_type_id: certificateTypeId,
    certificate_number: certificateNumber,
    certificate_expiry: certificateExpiry,
    media_document: mediaDocument,
    verification_status: verificationStatus,
    verification_notes: verificationNotes,
  });

  // Save the certification
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

    // Check if certificate exists
    const certificate = await certificateRepo.findOne({ where: { id: certificateId } });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // If a new partner is provided, check if the partner exists
    if (partnerId) {
      const partner = await partnerRepo.findOne({ where: { id: partnerId } });
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      certificate.partner = partner;
    }

    // Update the certificate details
    certificate.certificate_type_id = certificateTypeId || certificate.certificate_type_id;
    certificate.certificate_number = certificateNumber || certificate.certificate_number;
    certificate.certificate_expiry = certificateExpiry || certificate.certificate_expiry;
    certificate.media_document = mediaDocument || certificate.media_document;
    certificate.verification_status = verificationStatus || certificate.verification_status;
    certificate.verification_notes = verificationNotes || certificate.verification_notes;

    // Save the updated certificate
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

    // Check if certificate exists
    const certificate = await certificateRepo.findOne({ where: { id: certificateId } });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Delete the certificate
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

    // Check if the partner exists
  

    // Get all certificates for the partner
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

    // Find the certificate by ID
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
