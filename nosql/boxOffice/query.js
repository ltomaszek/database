/*
Importing data:
mongoimport "...\boxoffice.json" -d boxOffice -c movieStars --jsonArray --drop
*/

/* Movies with rating highter than 9.2 and a runtime lower than 100 */
db.movieStars.find({
    "meta.rating": {$gt: 9.2},
    "meta.runtime": {$lt: 100}    
})

/* Movies with genre of drama or action */
db.movieStars.find({
    $or: [
        {genre: "drama"},
        {genre: "thriller"}
    ]
})

/* Visitors exceeded expected Visitors */
db.movieStars.find({
    $expr: {
        $gt: [
            "$visitors",
            "$expectedVisitors"
        ]
    }
})

/* Movies with 3 genres */
db.movieStars.find({
    genre: {$size: 3}
})

/* Movies with genre: thriller, action and drama */
db.movieStars.find({
    genre: {
        $all: [
            "thriller",
            "drama",
            "action"
        ]
    }
})

// or
db.movieStars.find({
    $and: [
        {genre: "thriller"},
        {genre: "drama"},
        {genre: "action"}
    ]
})

/* Movies only with genre: thriller and aciton */
db.movieStars.find({
    $and: [
        {genre: {$size: 2}},
        {genre: {
            $all: [
                "thriller",
                "action"
            ]
        }}
    ]
})

/*
Importing data:
mongoimport "...\boxoffice-extended.json" -d boxOffice -c exmovieStars --jsonArray --drop
*/


/* Movies aired in 2018 */
db.exmovieStars.find({
    "meta.aired": 2018
})

/* Movies with at least one rating > 8 and < 10 */
db.exmovieStars.find({
    ratings: {
        $elemMatch: {
            $gt: 8,
            $lt: 10
        }
    }
})