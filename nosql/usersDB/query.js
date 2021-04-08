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

/* Remove field hasCar by cars fans */
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