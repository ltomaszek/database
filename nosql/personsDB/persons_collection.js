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
            age_sum: {$sum: "$age"}
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

/* Restructure output for people with age 25 */
db.persons.aggregate([
    {
        $match: {age: 25}
    },
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
    },
    {
        $sort: {name: 1}
    }
])

/* or */
db.persons.find(
    {
        age: 25
    },
    {
        _id: 0,
        name: 1,
        info: {
            age: "$age",
            eyes: "$eyeColor",
            fruit: "$favoriteFruit",
            country: "$company.location.country"
    }
}).sort({
    name: 1
})

/* Three youngest people sorted alphabetically */
db.persons.aggregate([
    {
        $match: {
            age: {$exists: true}
        }
    },
    {
        $sort: {
            age: 1,
            name: 1
        }
    },
    {
        $limit: 3
    }
])

/* or */
db.persons.find({
    age: {
        $exists: true
    }
}).sort({
    age: 1, 
    name: 1
}).limit(3)

/* Array of unique tags */
db.persons.aggregate([
    {
        $unwind: "$tags"
    },
    {
        $group: {_id: "$tags"}
    },
    {
        $sort: {_id: 1}
    }
]).toArray()

/* Sum of all people */
db.persons.aggregate([
    {
        $group: {
            _id: "all_people", 
            age_sum: {$sum: "$age"}
        }
    }
])

/* Average age by gender */
db.persons.aggregate([
    {
        $group: {
            _id: "$gender",
            avg_age: {$avg: "$age"}
        }
    }
])

/* Max female's age */
db.persons.aggregate([
    {
        $match: {gender: "female"}
    },
    {
        $group: {
            _id: "females_only",
            max_age: {$max: "$age"}
        }
    }
])

/* Gender information */
db.persons.aggregate([
    {
        $match: {
            gender: {$exists: true},
            age: {$exists: true}
        }
    },
    {
        $group: {
            _id: "$gender",
            min_age: {$min: "$age"},
            avg_age: {$avg: "$age"},
            max_age: {$max: "$age"},
            num_people: {$sum: 1}
        }
    }
])

/* Number of people within each age */
db.persons.aggregate([
    {
        $group: {
            _id: "$age",
            count: {$sum: NumberInt(1)}
        }
    },
    {
        $sort: {_id: 1}
    }
])

/* Favorite fruit by gender */
db.persons.aggregate([
    {
        $group: {
            _id: {
                favoriteFruit: "$favoriteFruit",
                gender: "$gender"
            },
            count: {$sum: NumberInt(1)}
        }
    },
    {
        $sort: {
            "_id.gender": 1,
            "_id.favoriteFruit": 1
        }
    }
])

/* Tags popularity */
db.persons.aggregate([
    {
        $unwind: "$tags"
    },
    {
        $group: {
            _id: "$tags",
            count: {$sum: NumberInt(1)}
        }
    },
    {
        $sort: {_id: 1}
    }
])

/* Average age by country */
db.persons.aggregate([
    {
        $group: {
            _id: "$company.location.country",
            avgAge: {$avg: "$age"}
        }
    }
])

/* Types of specific fields */
db.persons.aggregate([
    {
        $project: {
            name: 1,
            eyeColorType: {$type: "$eyeColor"},
            ageType: {$type: "$age"},
            companyType: {$type: "$company"},
            tagsType: {$type: "$tags"}
        }
    }
])

/* New collection - ageInfo */
db.persons.aggregate([
    {
        $group: {
            _id: "$age",
            count: {$sum: NumberInt(1)}
        }
    },
    {
        $sort: {_id: 1}
    },
    {
        $out: "ageInfo"
    }
])

/* If one stage exceeds 100 MB of RAM use allowDiskUse option */
db.persons.aggregate([
    {

    }
],
{
    allowDiskUse: true
})