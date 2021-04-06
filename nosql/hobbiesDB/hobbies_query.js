/* Create collection schema */
db.createCollection('hobbies', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['_id', 'name'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: 'must be an int and is required'
          },
          name: {
            bsonType: 'string',
            description: 'must be a string and is required'
          }
        }
      }
    },
  validationAction: 'warn'
  });
  
/* Insert data */
db.hobbies.insertMany([
    {_id: 'yoga', name: 'yoga'},
    {_id: 'cars', name: 'cars'},
    {_id: 'games', name: 'games'},
    {_id: 'soccer', name: 'soccer'}
    ],
    {ordered: false}        /* Skip duplicats, insert all unique */
);