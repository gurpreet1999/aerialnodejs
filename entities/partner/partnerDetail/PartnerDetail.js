const { EntitySchema } = require('typeorm');


// const UserSchema = new EntitySchema({
//   name: 'User',
//   tableName: 'users',
//   columns: {
//     id: {
//       type: 'bigint',
//       primary: true,
//       generated: true,
//     },
//     emailId: {
//       type: 'varchar',
//       length: 255,
//       unique: true,
//       nullable: false,
//     },
//     created_at: {
//       type: 'timestamp',
//       default: () => 'CURRENT_TIMESTAMP',
//     },
//   },
//   relations: {
//     role: {
//       type: 'many-to-one',
//       target: 'Role',
//       joinColumn: {
//         name: 'roleId',
//       },
//       onDelete: 'SET NULL',
//     },
    
//   },
// });

// const RoleSchema = new EntitySchema({
//   name: 'Role',
//   tableName: 'roles',
//   columns: {
//     id: {
//       type: 'int',
//       primary: true,
//       generated: true,
//     },
//     role_type: {
//       type: 'enum',
//       enum: ['Partner', 'Customer'],
//       nullable: false,
//     },
//   },
//   relations: {
//     users: {
//       type: 'one-to-many',
//       target: 'User',
//       mappedBy: 'role',
//     },
//   },
// });





const PartnerSchema = new EntitySchema({
  name: 'Partner',
  tableName: 'partners',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    userId: {
      type: 'int',
      nullable: false,
    },
    username: {
      type: 'varchar',
    },
    contact_number: {
      type: 'varchar',
      nullable: true,
      unique: true,
    },
    address: {
      type: 'varchar',
      nullable: true,
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    nickname: {
      type: 'varchar',
      nullable: true,
    },
    isBusiness: {
      type: 'boolean',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    // user: {
    //   type: 'one-to-one',
    //   target: 'User',
    //   joinColumn: {
    //     name: 'userId',
    //   },
    //   onDelete: 'CASCADE',
    // },
    skills: {
      type: 'many-to-many',
      target: 'Skills', 
      joinTable: {
        name: 'partner_skills',  
        joinColumn: {
          name: 'partner_id',  
          referencedColumnName: 'id',  
        },
        inverseJoinColumn: {
          name: 'skill_id',  
          referencedColumnName: 'skill_id',  
        },
      },
    },
    socialDetails: {
      type: 'one-to-one',
      target: 'PartnerSocialDetails',
      mappedBy: 'partner',  // Reference to the partner in social details
    },
    services: {
      type: 'one-to-many',
      target: 'PartnerServices',
      inverseSide: 'partner',  
    },
    equipment:{
      type: 'one-to-many',
      target: 'PartnerEquipments',
      inverseSide:'partner'
      
    },
    certificate:{
      type:"one-to-many",
      target:"PartnerCertificates",
      inverseSide:"partner"
    },
    resume:{
      type:"one-to-many",
      target:"PartnerResume",
      inverseSide:"partner"
    },
    roles: {
      type: 'many-to-many',
      target: 'PartnerRolesList',
      joinTable: {
        name: 'partner_roles',
        joinColumn: {
          name: 'partner_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'role_id',
          referencedColumnName: 'role_id',
        },
      },
    },
    location: {
      type: 'one-to-one',
      target: 'PartnerLocation',
      mappedBy: 'partner',
    },
  
    businesses: {
      type: 'one-to-many',
      target: 'PartnerBusiness',
      mappedBy: 'partner',
    },

    showreels: {
      type: 'one-to-many',
      target: 'PartnerShowreel',
      mappedBy: 'partner',
    },
  },
  
});


const PartnerBusinessSchema = new EntitySchema({
  name: 'PartnerBusiness',
  tableName: 'partner_business',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    partnerId: {
      type: 'int',
      nullable: false,
    },
    business_name: {
      type: 'varchar',
      nullable: false,
    },
    team_size: {
      type: 'int',
      nullable: true,
    },
  },
  relations: {
    partner: {
      type: 'many-to-one',
      target: 'Partner',
      joinColumn: {
        name: 'partnerId',
      },
      onDelete: 'CASCADE', 
    },
  },
});

const SkillsSchema = new EntitySchema({
  name: 'Skills',
  tableName: 'skills',
  columns: {
    skill_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    skill_category: {
      type: 'varchar',
      nullable: true,
    },
    skill_name: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    skill_description: {
      type: 'varchar',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    partners: {
      type: 'many-to-many',
      target: 'Partner',  // Reference to the Partner entity
     
    },
  },
});


const PartnerSocialDetailsSchema = new EntitySchema({
  name: 'PartnerSocialDetails',
  tableName: 'partner_social_details',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    partnerId: {
      type: 'int',
      unique: true,  // Ensure only one social detail per partner
      nullable: false,
    },
    facebook_link: {
      type: 'varchar',
      nullable: true,
    },
    instagram_link: {
      type: 'varchar',
      nullable: true,
    },
    linkedin_link: {
      type: 'varchar',
      nullable: true,
    },
    website_link: {
      type: 'varchar',
      nullable: true,
    },
    reach_in_kms: {
      type: 'int',
      nullable: true,
    },
    google_id: {
      type: 'varchar',
      nullable: false,
    },
  },
  relations: {
    partner: {
      type: 'one-to-one',
      target: 'Partner', 
      joinColumn: { name: 'partnerId' }, 
      onDelete: 'CASCADE', 
    },
  },
});



const PartnerServicesSchema = new EntitySchema({
  name: 'PartnerServices',
  tableName: 'partner_services',
  columns: {
    service_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    partnerId: {
      type: 'int',
    },
    service_title: {
      type: 'varchar',
      length: 255,
    },
    category: {
      type: 'varchar',
      nullable: true,
    },
    sub_category: {
      type: 'varchar',
      nullable: true,
    },
  
    service_deliverables: {
      type: 'text',
      nullable: true,
    },
 
    service_media_id: {
      type: 'int',
      nullable: true,
    },
    service_media_youtube_link: {
      type: 'varchar',
      nullable: true,
    },
    service_description: {
      type: 'text',
      nullable: true,
    },
    service_location: {
      type: 'varchar',
      nullable: true,
    },

    verification_status: {
      type: 'varchar',
      nullable: true,
    },
    verification_notes: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
    partnerId: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    partner: {
      type: 'many-to-one',
      target: 'Partner',
      inversedBy: 'services',  
      joinColumn: {
        name: 'partnerId',
      },
    },
    packages: {
      type: 'one-to-many',
      target: 'PartnerServicePackages',
      mappedBy: 'service',
    },
    
  
    keywords: {
      type: 'many-to-many',
      target: 'PartnerServiceKeyword',
      joinTable: {
        name: 'partner_service_keyword_links',
        joinColumn: {
          name: 'service_id',
        },
        inverseJoinColumn: {
          name: 'keyword_id',
        },
      },
    },
    faq:{
      type:"one-to-many",
      target:"PartnerServiceFaqs",
      mappedBy:"service"
    }
  },
});


const PartnerServicePackagesSchema = new EntitySchema({
  name: 'PartnerServicePackages',
  tableName: 'partner_service_packages',
  columns: {
    package_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    service_id: {
      type: 'int',
      nullable: false,
    },
    package_name: {
      type: 'varchar',
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    service: {
      type: 'many-to-one',
      target: 'PartnerServices',
      joinColumn: {
        name: 'service_id',
      },
      onDelete: 'CASCADE',
    },
  },
});

const PartnerServiceFaqsSchema = new EntitySchema({
  name: 'PartnerServiceFaqs',
  tableName: 'partner_service_faqs',
  columns: {
    faq_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    service_id: {
      type: 'int',
      nullable: false,
    },
    question: {
      type: 'varchar',
      length: 255,
    },
    answer: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    service: {
      type: 'many-to-one',
      target: 'PartnerServices',
      joinColumn: {
        name: 'service_id',
      },
      onDelete: 'CASCADE', 
    },
  },
});



const PartnerServiceKeywordSchema = new EntitySchema({
  name: 'PartnerServiceKeyword',
  tableName: 'partner_service_keywords',
  columns: {
    keyword_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    service_id: {
      type: 'int',
      nullable: false,
    },
    keyword: {
      type: 'varchar',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    service: {
      type: 'many-to-many',
      target: 'PartnerServices',
      inverseSide: 'keywords',
    },
  },
});


const PartnerEquipmentTypeSchema = new EntitySchema({
  name: 'PartnerEquipmentType',
  tableName: 'partner_equipment_types',
  columns: {
    equipment_type_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    equipment_type_name: {
      type: 'varchar',
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  equipments: {
    type: 'one-to-many',
    target: 'PartnerEquipments',
    mappedBy: 'equipmentType', 
  },
});




const PartnerEquipmentsSchema = new EntitySchema({
  name: 'PartnerEquipments',
  tableName: 'partner_equipments',
  columns: {
    equipment_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    user_id: {
      type: 'int',
      nullable: false,
    },
    equipment_type_id: {
      type: 'int',
      nullable: false,
    },
    equipment_name: {
      type: 'varchar',
      nullable: false,
    },
    equipment_model: {
      type: 'varchar',
      nullable: true,
    },
    equipment_status: {
      type: 'varchar',
      nullable: true,
    },
    equipment_description: {
      type: 'text',
      nullable: true,
    },
    verification_status: {
      type: 'varchar',
      nullable: true,
    },
    verification_notes: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    partner: {
      type: 'many-to-one',
      target: 'Partner',
      inversedBy: 'equipment',  
      joinColumn: {
        name: 'partnerId',
      },
      onDelete: 'CASCADE', // Optional: Define behavior on user deletion
    },
    equipmentType: {
      type: 'many-to-one',
      target: 'PartnerEquipmentType', 
      joinColumn: {
        name: 'equipment_type_id',
      },
      onDelete: 'CASCADE', // Optional: Define behavior on equipment type deletion
    },
  },
});




const PartnerCertificateTypesSchema = new EntitySchema({
  name: 'PartnerCertificateTypes',
  tableName: 'partner_certificate_types',
  columns: {
    certificate_type_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    certificate_type_name: {
      type: 'text',
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    
    certificates: {
      type: 'one-to-many',
      target: 'PartnerCertificates',
      mappedBy: 'certificateType',
    },
  },
});




const PartnerCertificatesSchema = new EntitySchema({
  name: 'PartnerCertificates',
  tableName: 'partner_certificates',
  columns: {
    certificate_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    partnerId: {
      type: 'int',
      nullable: false,
    },
    certificate_type_id: {
      type: 'int',
      nullable: true, // Make this column nullable
    },
    certificate_number: {
      type: 'text',
      nullable: false,
    },
    certificate_expiry: {
      type: 'date',
      nullable: false,
    },
    media_document: {
      type: 'varchar',
      nullable: true,
    },
    verification_status: {
      type: 'varchar',
      nullable: true,
    },
    verification_notes: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    partner: {
      type: 'many-to-one',
      target: 'Partner',
      joinColumn: {
        name: 'partnerId',
      },
      onDelete: 'CASCADE',
    },
    certificateType: {
      type: 'many-to-one',
      target: 'PartnerCertificateTypes',
      joinColumn: {
        name: 'certificate_type_id',
      },
      onDelete: 'SET NULL', 
    },
   
  },
});


const PartnerDroneTypeSchema = new EntitySchema({
  name: 'PartnerDroneType',
  tableName: 'partner_drone_type',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    droneId: {
      type: 'int',
      nullable: false,
    },
    category: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    drones: {
      type: 'one-to-many',
      target: 'PartnerDrone',
      mappedBy: 'droneType',
    },
  },
});



const PartnerDroneSchema = new EntitySchema({
  name: 'PartnerDrone',
  tableName: 'partner_drone',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    partnerId: {
      type: 'int',
      nullable: false,
    },
    drone_name: {
      type: 'varchar',
    },
    drone_model: {
      type: 'varchar',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
    drone_type_id: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    droneType: {
      type: 'many-to-one',
      target: 'PartnerDroneType',
      joinColumn: {
        name: 'drone_type_id',
      },
      inverseSide: 'drones',
    },
  },
});



const PartnerShowreelSchema = new EntitySchema({
  name: 'PartnerShowreel',
  tableName: 'partner_showreels',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    showreel_name: {
      type: 'varchar',
      nullable: false,
    },
    showreel_description: {
      type: 'varchar',
      nullable: true,
    },
    youtube_video_link: {
      type: 'varchar',
      nullable: true,
    },
    keyword: {
      type: 'varchar',
      nullable: true,
    },
    category: {
      type: 'varchar',
      nullable: true,
    },
  },
  relations: {
    partner: {
      type: 'many-to-one',
      target: 'Partner',
      joinColumn: {
        name: 'partnerId',
      },
      inverseSide: 'showreels',
      onDelete: 'CASCADE',
    },
  },
});






const PartnerResumeSchema = new EntitySchema({
  name: 'PartnerResume',
  tableName: 'partner_resume',
  columns: {
    resume_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    partnerId: {
      type: 'int',
      nullable: false,
    },
    resume_title: {
      type: 'text',
      nullable: false,
    },
    resume_description: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    partner: {
      type: 'many-to-one',
      target: 'Partner',
      joinColumn: {
        name: 'partnerId',
      },
      onDelete: 'CASCADE',
    },
    resumeExperience:{
      type:"one-to-many",
      target:"PartnerResumeExperience",
      inversedBy:"resume"
    }
  },
});



const PartnerResumeExperienceSchema = new EntitySchema({
  name: 'PartnerResumeExperience',
  tableName: 'partner_resume_experience',
  columns: {
    resume_experience_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    resume_id: {
      type: 'int',
      nullable: false,
    },
    company_name: {
      type: 'text',
      nullable: false,
    },
    job_title: {
      type: 'text',
      nullable: false,
    },
    start_date: {
      type: 'date',
      nullable: false,
    },
    end_date: {
      type: 'date',
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    resume: {
      type: 'many-to-one',
      target: 'PartnerResume',
      joinColumn: {
        name: 'resume_id',
      },
      onDelete: 'CASCADE',
    },
  },
});



const PartnerRolesListSchema = new EntitySchema({
  name: 'PartnerRolesList',
  tableName: 'partner_roles_list',
  columns: {
    role_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    role_name: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    role_category: {
      type: 'varchar',
      nullable: true,
    },
    role_description: {
      type: 'text',
      nullable: true,
    },
  },
  relations: {
    partners: {
      type: 'many-to-many',
      target: 'Partner',  
     
    },
  },
});




const PartnerLocationSchema = new EntitySchema({
  name: 'PartnerLocation',
  tableName: 'partner_locations',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    partnerId: {
      type: 'int',
      nullable: false,
    },
    location_name: {
      type: 'varchar',
      nullable: true,
    },
    country_id: {
      type: 'varchar',
      nullable: true,
    },
    state_id: {
      type: 'varchar',
      nullable: true,
    },
    city_id: {
      type: 'varchar',
      nullable: true,
    },
    location_lat: {
      type: 'int',
      nullable: true,
    },
    location_long: {
      type: 'int',
      nullable: true,
    },
  },
  relations: {
    partner: {
      type: 'one-to-one',
      target: 'Partner',
      joinColumn: {
        name: 'partnerId',
      },
      onDelete: 'CASCADE',
    },
  },
});



const PartnerMediaSchema = new EntitySchema({
  name: 'Media',
  tableName: 'media',
  columns: {
    media_id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    media_type: {
      type: 'enum',
      enum: ['photo', 'video'],
      nullable: false,
    },
    media_url: {
      type: 'text',
      nullable: false,
    },
    category_type: {
      type: 'enum',
      enum:['Equipment', 'Certificate','Service'],
      nullable: false,  //  etc.
    },
    category_id: {
      type: 'int',
      nullable: false,  // ID of the related entity
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  // No direct relations since it's a polymorphic association
});




module.exports = {
  PartnerSchema,
  SkillsSchema,
  PartnerSocialDetailsSchema,
  PartnerServicesSchema,
  PartnerServicePackagesSchema,
  PartnerServiceKeywordSchema,
  PartnerEquipmentsSchema,
  PartnerEquipmentTypeSchema,
  PartnerCertificateTypesSchema,
  PartnerCertificatesSchema,
  PartnerResumeSchema,
  PartnerResumeExperienceSchema ,
  PartnerRolesListSchema,
  PartnerLocationSchema,
  PartnerMediaSchema,
  PartnerBusinessSchema,
  // UserSchema,
  // RoleSchema 
  PartnerServiceFaqsSchema



};
