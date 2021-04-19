/* Insert one document */
db.sessions.insertOne({
    data: "xxx",
    createdAt: new Date()
})

/* Create TTL */
db.sessions.createIndex(
    {createdAt: 1},
    {expireAfterSeconds: 10}
)