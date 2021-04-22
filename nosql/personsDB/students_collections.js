/* Insert 2 new students */
db.students.insertMany([
    {
        studentId: NumberInt(1),
        lastName: "Wolf",
        firstName: "Eva",
        birth: new Date("1987-02-12"),
        year: {
            1994: {
                className: "1A",
                subjects: {
                    math: {
                        grades: [
                            {
                                grade: 5,
                                date: new Date("1994-10-02")
                            },
                            {
                                grade: 3,
                                date: new Date("1994-11-01")
                            },
                            {
                                grade: 4.5,
                                date: new Date("1994-11-22")
                            },
                            {
                                grade: 5,
                                date: new Date("1995-01-07")
                            }
                        ],
                        endGrade: 4.5
                    },
                    english: {
                        grades: [
                            {
                                grade: 3,
                                date: new Date(1994-10-05)
                            },
                            {
                                grade: 4,
                                date: new Date(1994-10-11)
                            },
                            {
                                grade: 2.5,
                                date: new Date(1994-11-12)
                            },
                            {
                                grade: 2.5,
                                date: new Date(1995-01-17)
                            }
                        ],
                        endGrade: 3
                    }
                }
            }
        }
    },
    {
        studentId: NumberInt(2),
        lastName: "Brown",
        firstName: "Marco",
        birth: new Date("1987-01-12"),
        year: {
            1994: {
                className: "1A",
                subjects: {
                    math: {
                        grades: [
                            {
                                grade: 4,
                                date: new Date("1994-10-02")
                            },
                            {
                                grade: 4,
                                date: new Date("1994-11-11")
                            },
                            {
                                grade: 4.5,
                                date: new Date("1994-11-22")
                            },
                            {
                                grade: 5,
                                date: new Date("1995-01-17")
                            }
                        ],
                        endGrade: 4.5
                    },
                    english: {
                        grades: [
                            {
                                grade: 3,
                                date: new Date(1994-10-06)
                            },
                            {
                                grade: 4,
                                date: new Date(1994-10-11)
                            },
                            {
                                grade: 2.5,
                                date: new Date(1994-10-12)
                            },
                            {
                                grade: 3,
                                date: new Date(1995-01-17)
                            }
                        ],
                        endGrade: 3
                    }
                }
            }
        }
    }
])

/* Show english grades for students from class 1A in year 1994 */
db.students.find(
    {
        "year.1994.className": "1A"
    },
    {
        lastName: 1,
        firstName: 1,
        "endGrade": "$year.1994.subjects.english.endGrade",
        "englishGrades": "$year.1994.subjects.english.grades"
    }
)

/* Add grade */
db.students.updateOne(
    {
        lastName: "Brown",
        firstName: "Marco",
        "year.1994.className": "1A"
    },
    {
        $push: {
            "year.1994.subjects.english.grades": {
                grade: 3.5,
                date: new Date()
            }
        }
    }
)

/* Array of grades from one student, subject, year*/
db.students.aggregate([
    // match specific student
    {
        $match: {
            lastName: "Brown",
            firstName: "Marco",
            "year.1994.className": "1A"
        }
    },
    // project only grades field
    {
        $project: {
            _id: 0,
            grades: "$year.1994.subjects.english.grades"
        }
    },
    // unwind grades from array
    {
        $unwind: "$grades"
    },
    // project only grade without date
    {
        $project: {
            grade: "$grades.grade"
        }
    }
]).toArray()

db.students.find(
    {
        $not: [true]
    },
    {
        year: {$year: "$birth"}
    }
)

/* All students born in 1987 */
db.getCollection('students').find({
    birth: {
        $gte: new Date("1987-01-01"),
        $lt: new Date("1988-01-01")
    },
    1875: "1876"
})
