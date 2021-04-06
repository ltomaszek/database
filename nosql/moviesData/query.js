/* Movies with runtime < 60 */
db.movies.find(
    {runtime: {$lt: 60}}
)

/* Movies with rating greater or equal to 9.0 */
db.movies.find(
    {"rating.average": {$gte: 9.0}}
)

// or
db.movies.find(
    {$expr: {$gte: ["$rating.average", 9.0]}}
)

// or
db.movies.find(
    {$expr: {$gte: [
        {$add: ["$rating.average", 1]}
        , 10.0]}}
)

// or
db.movies.find(
    {$expr: {$gte: [{
        $cond: {
            if: {$lte: ["$rating.average", 10.0]}, 
            then: {
                $add: ["$rating.average", 1]
            },
            else: "$rating.average"
            }
        }, 
        10.0]}}
)

/* Thriller movies */
db.movies.find(
    {genres: "Thriller"}
)

/* Exact genres */
db.movies.find(
    {genres: ["Drama", "Horror", "Thriller"]}
)

/* Movies not in English */
db.movies.find(
    {language: {$ne: "English"}}
)

// or
db.movies.find(
    {language: {$not: {$eq: "English"}}}
)

/* Number of movies in English */
db.movies.find(
    {language: "English"}
).count()

/* Movies with id <= 3 or id between 11-13 */
db.movies.find(
    {$or: [
        {id: {$lte: 3}},
        {$and: [
            {id: {$gt: 10}},
            {id: {$lte: 13}}
        ]}
    ]}
)

/* Movies where webChannel exists and is not null */
db.movies.find(
    {webChannel: {$exists: true, $ne: null}}
)

// or
db.movies.find(
    {webChannel: {$exists: true, $not: {$type: "null"}}}
)

// or
db.movies.find(
    {webChannel: {$exists: true, $not: {$type: ["null", "null", "null"]}}}
)

/* Movies with 'musical' in summary*/
db.movies.find(
    {summary: {$regex: /musical/}}
)

/* Movies where runtime is greater than weight */
db.movies.find(
    {$expr: {$gt: ["$runtime", "$weight"]}}
)