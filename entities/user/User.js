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
    
    role: {
      type: 'many-to-one',
      target: 'Role',
      
      joinColumn: {
        name: 'roleId',
      },
      onDelete: 'SET NULL',
    },
    partner: {
      type: 'one-to-one',
      target: 'Partner',
      nullable: true,
      mappedBy: 'user',
    },
    customer: {
      type: 'one-to-one',
      target: 'Customer',
      nullable: true,
      mappedBy: 'user',
    },
  }

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
      enum: ['Partner', 'Customer'],
      nullable: false,
    },
  },
  relations: {
    users: {
      type: 'one-to-many',
      target: 'User',
      mappedBy: 'role',
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