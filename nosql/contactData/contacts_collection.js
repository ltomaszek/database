/* Show indexes */
db.contacts.getIndexes()

/* Create age index */
db.contacts.createIndex({
    "dob.age": 1
})

/* Drop age index */
db.contacts.dropIndex({
    "dob.age": 1
})

/* Create compound index */
db.contacts.createIndex({
    "dob.age": 1,
    gender: 1
})

/* Drop compound index */
db.contacts.dropIndex({
    "dob.age": 1,
    gender: 1
})

/* */
db.contacts.explain().find({
    "dob.age": 35,
    gender: "male"
})

/* */
db.contacts.explain().find({
    "dob.age": 35
}).sort({
    gender: 1
})

/* Create index with unique email - fails if there are duplicats in the collection */
db.contacts.createIndex(
    {email: 1},
    {unique: true}
)

/* Avoide non-existing as duplicate email clash */
db.contacts.createIndex(
    {email: 1},
    {
        unique: true,
        partialFilterExpression: {
            email: {$exists: true}
        }
    }
)

/* Create index with partialFilterExpression */
db.contacts.createIndex(
    {"dob.age": 1},
    {
        partialFilterExpression: 
            {gender: "male"}
    }
)

/* Create index with partialFilterExpression */
db.contacts.createIndex(
    {"dob.age": 1},
    {
        partialFilterExpression: 
            {"dob.age": {$gte: 60}}
    }
)


/* Show emails and ages of males in their 60s ordered asc by email */
db.contacts.find(
    {
        gender: "male",
        $and: [
            {"dob.age": {$gte: 60}},
            {"dob.age": {$lt: 70}}
        ]
    },
    {
        _id: 0,
        "dob.age": 1,
        email: 1
    }
).sort({
    email: 1
})

/* Contacts2 */
db.contacts2.insertMany(
    [
        {
            name: "Max",
            hobbies: ["Cooking", "Sports"],
            addresses: [
                {street: "Main Street"},
                {street: "Second Street"}
            ]
        },
        {
            name: "David",
            hobbies: ["Running", "Cars"],
            addresses: [
                {street: "5th Street"},
                {street: "3rd Street"}
            ]
        }
    ]
)

/* Create hobbies index */
db.contacts2.createIndex({
    hobbies: 1
})

/* */
db.contacts2.explain("executionStats").find({
    hobbies: "Cars"
})

/* Create addresses index in foreground (collection is locked during creation) */
db.contacts2.createIndex({
    addresses: 1
})

/* Create addresses index in background (collection is available during creation) */
db.contacts2.createIndex(
    {addresses: 1},
    {background: true}
)

/* CALLSCAN */
db.contacts2.explain("executionStats").find({
    "addresses.street": "Main Street"
})

/* IXSCAN, indexName: "addresses_1" */
db.contacts2.explain("executionStats").find({
    addresses: {street: "Main Street"}
})

/* Add another street to David */
db.contacts2.updateOne(
    {
        name: "David"
    },
    {
        $push: {
            addresses: {street: "Second Street"}
        }
    }
)