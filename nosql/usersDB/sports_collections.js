/* Insert new documents */
db.sports.insertMany([
    {
        title: 'football',
        requiresTeam: true
    },
    {
        title: 'running'
    },
    {
        title: 'golf'
    }
])

/* Upsert documents */
db.sports.updateMany(
    {title: 'running'},
    {$set: {
        title: 'running'
    }},
    {upsert: true}
)

db.sports.updateMany(
    {title: 'yoga'},
    {$set: {
        requiresTeam: false
    }},
    {upsert: true}
)

/* Add field minPlayers to sports that require team */
db.sports.updateMany(
    {
        requiresTeam: true, 
        minPlayers: {$exists: false}
    },
    {
        $set: {
            minPlayers: 2
        }
    }
)

/* Increase num of required players by 2 */
db.sports.updateMany(
    {
        requiresTeam: true
    },
    {
        $inc: {
            minPlayers: 2
        }
    }
)