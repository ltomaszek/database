/* Insert values */
db.shoppingCard.insertMany([
    {index: NumberInt(1)},
    {index: NumberInt(2)},
    {index: NumberInt(3)},
    {index: NumberInt(4)},
    {index: NumberInt(5)}
])

/* Update */
db.shoppingCard.update(
    {
        index: 2
    },
    {
        $set: {
            cardId: NumberInt(325),
            customer: {
                name: "Mike Foster",
                email: "mfoster@test.com",
                age: NumberInt(27)
            },
        cart: []
        }
    }
)

/* Add new field with current date to all documents */
db.shoppingCard.update(
    {},
    {
        $set: {
            date: new Date()
        }
    },
    {
        multi: true
    }
)

/* Remove the date frield */
db.shoppingCard.update(
    {},
    {
        $unset: {date: 1}
    },
    {
        multi: true
    }
)

/* or */
db.shoppingCard.updateMany(
   {},
   {
       $unset: {date: 1}
   }
)

/* Replace document with index 2 */
db.shoppingCard.replaceOne(
   {
       index: 2
   },
   {
       index: 2
   }
)

/* Add field cardNumber */
db.shoppingCard.updateMany(
    {},
    {
        $set: {cardNumber: []}
    }
)

/* Rename cardId field */
db.shoppingCard.updateMany(
    {},
    {
        $rename: {
            cardNumber: "cardId"
        }
    }
) 

/* Update field updatedAt to current date */
db.shoppingCard.updateOne(
    {
        index: 1
    },
    {
        $set: {
            updatedAt: new Date()
        }
    }
)

/* or */
db.shoppingCard.updateOne(
    {
        index: 1
    },
    {
        $currentDate: {
            updatedAt: true
        }
    }
)

/* Create new array field with first item, and update updatedAt field */
db.shoppingCard.updateMany(
    {index: 2},
    {
        $set: {
            cart: ['First item'],
        },
        $currentDate: {
            updatedAt: true
        }
    }
)

/* Add another item to the cart array */
db.shoppingCard.updateMany(
    {index: 2},
    {
        $push: {
            cart: "Second item"
        },
        $currentDate: {
            updatedAt: true
        }
    }
)

/* Add 3 elements to the cart array */
db.shoppingCard.updateMany(
    {
        index: {$lte: 3}
    },
    {
        $push: {
            cart: {$each: [
                    "element 1",
                    "element 2",
                    "element 3"
                ]
            }
        },
        $currentDate: {
            updatedAt: true
        }
    }
)

/* Add item to array if it does not exist yet */
db.shoppingCard.updateOne(
    {
        index: 4
    },
    {
        $addToSet: {
            cart: "First item"
        }
    }
)

/* Remove last element in cart array for each person */
db.shoppingCard.updateMany(
    {},
    {
        $pop: {
            cart: 1
        }
    }
)

/* Remove first element in cart array for each person */
db.shoppingCard.updateMany(
    {},
    {
        $pop: {
            cart: -1
        }
    }
)

/* Remove from cart array all 'element 2' elements */
db.shoppingCard.updateMany(
    {},
    {
        $pull: {
            cart: "element 2"
        }
    }
)

/* Add field spentAmounts, and update field cart */
db.shoppingCard.updateOne(
    {
        index: 1
    },
    {
        $push: {
            cart: {$each: [
                "item 1",
                "item 2",
                "item 3",
                "item 3"
            ]}
        },
        $addToSet: {
            spentAmounts: {$each: [
                NumberInt(325),
                NumberInt(200),
                NumberInt(110),
                NumberInt(425)
            ]}
        }
    }
)

/* Remove item 2 and item 3 from cart array and amounts >= 200 from spentAmounts array */
db.shoppingCard.updateOne(
    {
        index: 1
    },
    {
        $pullAll: {
            cart: [
                "item 2",
                "item 3"
            ],
            spentAmounts: {$gte: 200}
        }
    }
)

/* or */
db.shoppingCard.updateOne(
    {
        index: 1
    },
    {
        $pull: {
            cart: {$in: [
                "item 2",
                "item 3"
            ]},
            spentAmounts: {$gte: 200}
        }
    }
)

/* In index 1 change one 'item 3' to 'changed item' */
db.shoppingCard.updateOne(
    {
        index: 1,
        cart: "item 3"
    },
    {
        $set: {
            "cart.$" : "changed item"
        }
    }
)

/* Change cart for person with index 2 */
db.shoppingCard.updateOne(
    {
        index: 2
    },
    {
        $set: {
            cart: [
                {
                    title: "TV",
                    price: NumberInt(350)
                },
                {
                    title: "Phone",
                    price: NumberInt(80)
                }
            ]
        }
    }
)

/* Change the price of 'Phone' to 25 */
db.shoppingCard.updateOne(
    {
        index: 2,
        "cart.title": "Phone"
    },
    {
        $set: {
            "cart.$.price": NumberInt(25)
        }
    }
)

/* Change the price of 'Phone' from 25 to 35 */
db.shoppingCard.updateOne(
    {
        index: 2,
        cart: {$elemMatch: {
            title: "Phone",
            price: 25
        }}
    },
    {
        $set: {
            "cart.$.price": NumberInt(35)
        }
    }
)


/* Increment price of one 'Phone' in each document by 11 
   If there are more 'Phone' records in the cart array, 
   then only the price for the first one will be incremented */
db.shoppingCard.updateMany(
    {
        "cart.title": "Phone"
    },
    {
        $inc: {
            "cart.$.price": NumberInt(11)
        }
    }
)