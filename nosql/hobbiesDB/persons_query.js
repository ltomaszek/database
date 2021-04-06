/* Create collection schema */
db.createCollection("persons", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "hobbies"],
      properties: {
        _id: {
          bsonType: "number",
          description: "must be an int and is required",
        },
        name: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        hobbies: {
          bsonType: "array",
          description: "must be an array and is required",
          items: {
            bsonType: "string",
          },
        },
      },
    },
  },
});

/* Insert data */
db.persons.insertOne({ _id: 1, name: "Max", hobbies: [] });
db.persons.insertMany(
  [
    { _id: 2, name: "Eva", hobbies: ["yoga", "cars"] },
    { _id: 11, name: "Marco", hobbies: ["games", "cars", "soccer"] },
  ],
  { ordered: false },
  { writeConcert: { w: 1, j: true, wtimeout: 10 } }
);
db.persons.insertOne({
  _id: 4,
  name: "Strange",
  hobbies: ["unknown hobby", "another unknown hobby"],
});
db.persons.insertOne(
  { _id: 5, name: "Alex", hobbies: ["yoga"] },
  { writeConcert: { w: 1 } }
);
db.persons.insertOne(
  { _id: 10, name: "Michi", hobbies: ["cars"] },
  { writeConcert: { w: 1, j: true, wtimeout: 10 } }
);

/* Aggregate view */
db.persons.aggregate([
  {
    $lookup: {
      from: "hobbies",
      localField: "hobbies",
      foreignField: "_id",
      as: "person hobbies",
    },
  },
]);
