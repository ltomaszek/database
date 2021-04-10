/* Users with existing, not null age */
db.users.find({
    age: {
        $exists: true,
        $ne: null
    }
})

/* Increment users age by one */
db.users.updateMany(
    {age: {$exists: true, $ne: null}},
    {$inc: {age: 1}}
)

/* Override Max' hobbies */
db.users.updateOne(
    {name: "Max"},
    {$set: 
        {hobbies: [
            {title: "Cars", frequency: 5},
            {title: "Running", frequency: 1}
    ]}}
)

/* Add additional fields to fans of cars */
db.users.updateMany(
    {"hobbies.title": "Cars"},
    {$set: {
        likesCars: true,
        hasCar: true
    }}
)

/* Chris' age should be 2 if his current age is greater than 2 */
db.users.updateOne(
    {name: "Chris"},
    {$min: {age: 2}}
)

/* Manuel's age should be 35 if his current age is smaller than 35 */
db.users.updateOne(
    {name: "Manuel"},
    {$max: {age: 35}}
)

/* Multiply everybody's age by 2 */
db.users.updateMany(
    {age: {$exists: true, $ne: null}},
    {$mul: {age: 2}}
)

/* Remove field hasCar by cars fans */go
db.users.updateMany(
    {likesCars: true},
    {$unset: {hasCar: ""}}
)

/* Rename field likesCars to isCarsFan */
db.users.updateMany(
    {},
    {$rename: {likesCars: "isCarsFan"}}
)

/* Update all Evas with age 28 or create a new user if no Evas exist */
db.users.updateMany(
    {name: "Eva", age: 28},
    {$set: {
        age: 29,
        hobbies: [
            {title: "Eating", frequency: 21}
        ]
    }},
    {upsert: true}
)

/* Add field phone with value null to users without phone */
db.users.updateMany(
    {phone: {$exists: false}},
    {$set: {phone: null}}
)

/* Increase frequency and add field 'highFrequency' to document in users with hobby 'Cars' and frequency >= 5 */
db.users.updateMany(
    {
        hobbies: { 
            $elemMatch: {
                title: "Cars",
                frequency: {$gte: 5}
            }
        }
    },
    {
        $set: {
            "hobbies.$.highFrequency": true
        },
        $inc: {
            "hobbies.$.frequency": 1
        }
    }
)

/* Adding new field to all documents in hobbies' array */
db.users.updateMany(
    {
        "hobbies.title": {
            $exists: true
        }
    },
    {
        $set: {
            "hobbies.$[].isHobby": true
        }
    }
)

/* Add field goodFrequency: true in all documents with frequency between 4 and 10 */
db.users.updateMany(
    {
        $and: [
            {"hobbies.frequency": {$gte: 4}},
            {"hobbies.frequency": {$lte: 10}}
        ]
    },
    {
        $set: {
            "hobbies.$[el].goodFrequency": true
        }
    },
    {
        arrayFilters: [
            {$and: [
                {"el.frequency": {$gte: 4}},
                {"el.frequency": {$lte: 10}}
            ]}
        ]
    }
)

/* Add Sports hobby to each Eva that is younger than 29 */
db.users.updateMany(
    {
        name: "Eva",
        age: {$lt: 29}
    },
    {
        $push: {
            hobbies: {
                title: "Sports",
                frequency: 2
            }
        }
    }
)

/* Add 2 more hobbies to each Anna */
db.users.updateMany(
    {
        name: "Anna"
    },
    {
        $push: {
            hobbies: {
                $each: [
                    {title: "Running", frequency: 7},
                    {title: "AAA", frequency: 5}
                ],
                $sort: {
                    title: 1
                },
                $slice: 1
            }
        }
    }
)

/* Remove from Annas all hobbies with frequency equal to 5 */
db.users.updateMany(
    {
        name: "Anna"
    },
    {
        $pull: {
            hobbies: {
                frequency: 5
            }
        }
    }
)

/* Remove Chris' last hobby */
db.users.updateOne(
    {
        name: "Chris"
    },
    {
        $pop: {
            hobbies: 1
        }
    }
)

/* Add Cars hobbie to Chris' array if it does not exists yet */
db.users.updateOne(
    {
        name: "Chris"
    },
    {
        $addToSet: {
            hobbies: {
                title: "Cars",
                frequency: 3
            }
        }
    }
)

/* Replace Chris' values */
db.users.replaceOne(
    {
        name: "Chris"
    },
    {
        name: "Chris",
        hobbies: [],
        age: 35
    }
)

/* Update Evas' values */
db.users.updateMany(
    {
        name: "Eva"
    },
    {
        $set: {
            hobbies: [{
                title: "Running",
                frequency: 7
            }]
        }
    }
)