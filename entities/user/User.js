const { EntitySchema } = require('typeorm');


const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'bigint',
      primary: true,
      generated: true,
    },
    emailId: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    roles: {
      type: 'many-to-many',
      target: 'Role',
      joinTable: {
        name: 'user_roles', // Custom join table name
        joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'role_id',
          referencedColumnName: 'id',
        },
      },
    },
    languages: {
      type: 'many-to-many',
      target: 'Language',
      inverseSide: 'users',
      joinTable: {
        name: 'user_languages',
        joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'language_id',
          referencedColumnName: 'id',
        },
      },
    },
    customer: {
      type: 'one-to-one',
      target: 'Customer',
      cascade: true,
      inverseSide: 'user',
    },
    partner: {
      type: 'one-to-one',
      target: 'Partner',
      cascade: true,
      inverseSide: 'user',
    },

  },
});

const RoleSchema = new EntitySchema({
  name: 'Role',
  tableName: 'roles',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    role_type: {
      type: 'enum',
      enum: ['Partner', 'Customer', 'Seller'], // Add other roles as needed
      nullable: false,
    },
  },
  relations: {
    users: {
      type: 'many-to-many',
      target: 'User',
      mappedBy: 'roles',
    },
  },
});



const LanguageSchema = new EntitySchema({
  name: 'Language',
  tableName: 'languages',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 100,
    },
  },
  relations: {
    users: {
      type: 'many-to-many',
      target: 'User',
      inverseSide: 'languages',
      
    },
  },
});


module.exports={UserSchema,RoleSchema,LanguageSchema}