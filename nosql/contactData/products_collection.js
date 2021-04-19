/* Add products */
db.products.insertMany([
    {
        title: "Harry Potter",
        description: "An awesome book about a strange boy."
    },
    {
        title: "Around the word in 80 days",
        description: "Adventure book with some fascinating moments."
    },
    {
        title: "365 days",
        description: "A love story with a hard beginning."
    }
])

/* Create a text index */
db.products.createIndex({
    description: "text"
})

/* Using text index to find documents that have following 3 words */
db.products.find({
    $text: {
        $search: "adventure awesome story"
    }
})

/* Using text index to find documents with that exact phrase */
db.products.find({
    $text: {
        $search: "\"LOVE story\""
    }
})

/* Insert one element */
db.products.insertOne({
    title: "T-Shirt",
    description: "A white T-Shirt"
})

/* Using text score for sorting */
db.products.find(
    {
        $text: {$search: "awesome t-shirt"}
    },
    {
        score: {$meta: "textScore"}
    }
)

/* or */
db.products.find(
    {
        $text: {$search: "awesome t-shirt"}
    }
).sort({
    score: {$meta: "textScore"}
})

/* Drop current text index */
db.products.dropIndex("description_text")

/* Create combined text index */
db.products.createIndex({
    title: "text",
    description: "text"
})

/* Exclude words in search - find books that are not adventure */
db.products.find({
    $text: {$search: "book -adventure"}
})

/* Drop combined text index */
db.products.dropIndex("title_text_description_text")

/* Create text index where default language is English and title is twice as important as description */
db.products.createIndex(
    {
        title: "text",
        description: "text"
    },
    {
        default_language: "english",
        weights: {
            title: 2,
            description: 1
        }
    }
)

/* Find Potter*/
db.products.find(
    {
        $text: {
            $search: "Potter",
            $caseSensitive: true
        }
    }
)