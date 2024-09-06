const { EntitySchema } = require('typeorm');

const CustomerSchema = new EntitySchema({
  name: 'Customer',
  tableName: 'customer_table',
  columns: {
    id: {
      type: 'bigint',
      primary: true,
      generated: true,
    },
    userId:{
        type:'bigint',
        nullable: false,
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    phone_number: {
      type: 'varchar',
      length: 15,
      nullable: true,
    },
    address: {
      type: 'text',
      nullable: true,
    },
    message: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
    current_status: {
      type: 'enum',
      enum: ['New', 'In Progress', 'On Hold', 'Resolved', 'Escalated', 'Closed', 'Cancelled'],
      default: 'New',
    },
   
},
relations: {
  user: {
    type: 'one-to-one',
    target: 'User',
    joinColumn: {
      name: 'userId',
    },
    onDelete: 'CASCADE',
  },
},
});

module.exports = {CustomerSchema};
