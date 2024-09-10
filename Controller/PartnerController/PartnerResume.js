const { getRepository } = require('typeorm');
const {PartnerResumeSchema,PartnerResumeExperienceSchema}=require("../../entities/partner/partner.js")


const addExperienceToResume = async (req, res) => {
  const { resume_id, company_name, job_title, start_date, end_date, description } = req.body; // Extract details from request body

  try {
    const resumeRepo = getRepository(PartnerResumeSchema);
    const experienceRepo = getRepository(PartnerResumeExperienceSchema);

   
    const resume = await resumeRepo.findOne({ where: { resume_id } });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

   
    const newExperience = experienceRepo.create({
      resume_id,
      company_name,
      job_title,
      start_date,
      end_date,
      description,
    });

  
    await experienceRepo.save(newExperience);

    res.status(201).json({ message: 'Experience added successfully', experience: newExperience });
  } catch (error) {
    console.error('Error adding experience to resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const updateExperience = async (req, res) => {
  const { resume_experience_id } = req.params; 
  const { company_name, job_title, start_date, end_date, description } = req.body; 

  try {
    const experienceRepo = getRepository(PartnerResumeExperienceSchema);

  
    const experience = await experienceRepo.findOne({ where: { resume_experience_id } });
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

 
    experience.company_name = company_name ?? experience.company_name;
    experience.job_title = job_title ?? experience.job_title;
    experience.start_date = start_date ?? experience.start_date;
    experience.end_date = end_date ?? experience.end_date;
    experience.description = description ?? experience.description;

  
    await experienceRepo.save(experience);

    res.status(200).json({ message: 'Experience updated successfully', experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const deleteExperience = async (req, res) => {
  const { resume_experience_id } = req.params; 

  try {
    const experienceRepo = getRepository(PartnerResumeExperienceSchema);

  
    const experience = await experienceRepo.findOne({ where: { resume_experience_id } });
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

  
    await experienceRepo.remove(experience);

    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  addExperienceToResume,
  updateExperience,
   deleteExperience  
};
