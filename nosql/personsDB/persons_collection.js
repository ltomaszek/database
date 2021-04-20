/* Number of people with age greater or equal to 25 but not 30 */
db.persons.find({
    age: {
        $gt: 25, 
        $ne: 30
    }
}).count()

/* or */
db.persons.find({
    $and: [
        {age: {$gt: 25}},
        {age: {$ne: 30}}
    ]
}).count()

/* or */
db.persons.find({
    age: {
        $gt: 25,
        $nin: [30]
    }
}).count()

/* Number of males younger than 25 and greater or equal to 75 */
db.persons.find({
    gender: "male",
    $or: [
        {age: {$lt: 25}},
        {age: {$gte: 75}}
    ]
}).count()

/* People who are younger than 24 or like bananas or color of the eyes is either green or blue */
db.persons.find({
    $or: [
        {age: {$lt: 24}},
        {favoriteFood: "banana"},
        {eyeColor: {$in: ["blue", "green"]}}
    ]
})

/* People who work for USA company */
db.persons.find({
    "company.location.country": "USA"
})

/* People with age >= 34, but not 37 who work in Italy */
db.persons.find({
    $or: [
        {age: {$gte: 33, $ne: 37}},
        {"company.location.country": "Italy"}
    ]
})

/* People with tags size of 4 */
db.persons.find({
    tags: {$size: 4}
})

/* People with tags: id and ad */
db.persons.find({
    tags: {$all: [
        "id",
        "ad"
    ]}
})

/* People with second tag "ad" and where tags array consists of exactly 3 tags */
db.persons.find({
    tags: {$size: 3},
    "tags.1": "ad"
})

/* People who have a friend named Bob */
db.persons.find({
    "friends.name": "Bob"
})

/* Looking for exact friends' document - order of keys matter */
db.persons.find({
    friends: {
        name: "Bob",
        age: 25,
        registered : false
    }
})

/* or - order and number of keys does not matter */
db.persons.find({
    friends: {$elemMatch: {
        age: 25,
        name: "Bob"
    }}
})

/* People with blue eyes */
db.persons.find(
    {
        eyeColor: "blue"
    },
    {
        name: 1,
        age: 1,
        gender: 1,
        eyeColor: 1,
        company: 1
    }
)

/* People with name starting with 'gra', i - case insensitive */ 
db.persons.find({
    name: {$regex: /^gra/i}
})

/* or */
db.persons.find({
    name: {
        $regex: /^gra/,
        $options: "i"
    }
})

/* or */
db.persons.find({
    name: {
        $regex: "^gra",
        $options: "i"
    }
})

/* AGGREGATE */

db.persons.aggregate([])

/* Group by age */
db.persons.aggregate([
    {
        $group: {_id: "$age"}
    }
])

/* Group by country */
db.persons.aggregate([
    {
        $group: {_id: "$company.location.country"}
    }
])

/* Group by age, show total age sum */
db.persons.aggregate([
    {
        $group: {
            _id: "$age",
            age_sum: {$sum: "$age"},
            name: "$name"
        }
    }
])

/* Group by a pair: age and gender, show sum of age */
db.persons.aggregate([
    {
        $group: {
            _id: {
                age: "$age",
                gender: "$gender"
            },
            age_sum: {$sum: "$age"},
        }   
    }
])

/* Find all documents where age = 25 */
db.persons.aggregate([
    {
        $match: {age: 25}
    }
])

/* or */
db.persons.find({
    age: 25
})

/* Females with age >= 38 */
db.persons.aggregate([
    {
        $match: {
            $and: [
                {gender: "female"},
                {age: {$gte: 38}}
            ]
        }
    }
])

/* or */
db.persons.find({
    gender: "female",
    age: {$gte: 38}
})

/* Group males by age, favorite fruit and country */
db.persons.aggregate([
    // stage 1
    {
        $match: {gender: "male"}
    },
    // stage 2
    {
        $group: {
            _id: {
                age: "$age",
                favoriteFruit: "$favoriteFruit",
                country: "$company.location.country"
            }
        }
    },
    // stage 3
    {
        $sort: {
            "_id.age": 1,
            "_id.country": 1,
            "_id.favoriteFruit": 1
        }
    }
    /*
    // stage 3
    {
        $count: "allPossibleResults"
    }
    */
])

/* Number of all unique ages */
db.persons.aggregate([
    {
        $group: {
            _id: {
                age: "$age"
            }
        }
    },
    {
        $count: "ageCount"
    }
])

/* Sort people by gender, age, name */
db.persons.aggregate([
    {
        $sort: {
            gender: -1,
            age: 1,
            name: 1
        }
    }
])

/* or */
db.persons.find().sort({
    gender: -1,
    age: 1,
    name: 1
})

/* Show specific fields */
db.persons.aggregate([
    {
        $project: {
            isActive: 1,
            name: 1,
            gender: 1
        }
    }
])

/* or */
db.persons.find(
    {},
    {
        isActive: 1,
        name: 1,
        gender: 1
    }
)

/* Different output structure */
db.persons.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            info: {
                age: "$age",
                eyes: "$eyeColor",
                fruit: "$favoriteFruit",
                country: "$company.location.country"
            }
        }
    }
])

/* or */
db.persons.find(
    {},
    {
        _id: 0,
        name: 1,
        info: {
            age: "$age",
            eyes: "$eyeColor",
            fruit: "$favoriteFruit",
            country: "$company.location.country"
    }
})