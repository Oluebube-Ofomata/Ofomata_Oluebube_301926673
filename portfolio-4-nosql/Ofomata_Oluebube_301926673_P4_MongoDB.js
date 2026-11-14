// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("library_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("library_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "book_registered",
                    "student_registered"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "loan"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "loan_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("library_events").insertMany([
    {
        "_id": "event_000001",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "book_registered",
        "occurredAt": ISODate("2030-01-01T10:00:00Z"),
        "source": {
            "entity": "loan",
            "key": {
                "loan_id": 401
            },
            "snapshot": {
                "loan_id": 401,
                "book_id": 101,
                "student_id": 201,
                "librarian_id": 301,
                "borrowed_on": "2025-02-01",
                "due_on": "2025-02-15",
                "returned_on": null,
                "fine_amount": 0
            }
        },
        "embedded": {
            "book": [
                {
                    "key": {
                        "book_id": 101
                    },
                    "snapshot": {
                        "book_id": 101,
                        "isbn": "9780000000101",
                        "title": "Synthetic Library Systems",
                        "author": "A. Example",
                        "publication_year": 2020
                    },
                    "via": [
                        "loan.book_id → book"
                    ]
                }
            ],
            "student": [
                {
                    "key": {
                        "student_id": 201
                    },
                    "snapshot": {
                        "student_id": 201,
                        "university_email": "student201@example.edu",
                        "registered_on": "2025-01-10"
                    },
                    "via": [
                        "loan.student_id → student"
                    ]
                }
            ],
            "librarian": [
                {
                    "key": {
                        "librarian_id": 301
                    },
                    "snapshot": {
                        "librarian_id": 301,
                        "university_email": "librarian301@example.edu",
                        "display_name": "Synthetic Librarian",
                        "hired_on": "2024-06-01"
                    },
                    "via": [
                        "loan.librarian_id → librarian"
                    ]
                }
            ]
        },
        "references": {},
        "details": {
            "channel": "web"
        }
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "student_registered",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
        "source": {
            "entity": "loan",
            "key": {
                "loan_id": 401
            },
            "snapshot": {
                "loan_id": 401,
                "book_id": 101,
                "student_id": 201,
                "librarian_id": 301,
                "borrowed_on": "2025-02-01",
                "due_on": "2025-02-15",
                "returned_on": null,
                "fine_amount": 0
            }
        },
        "embedded": {
            "book": [
                {
                    "key": {
                        "book_id": 101
                    },
                    "snapshot": {
                        "book_id": 101,
                        "isbn": "9780000000101",
                        "title": "Synthetic Library Systems",
                        "author": "A. Example",
                        "publication_year": 2020
                    },
                    "via": [
                        "loan.book_id → book"
                    ]
                }
            ],
            "student": [
                {
                    "key": {
                        "student_id": 201
                    },
                    "snapshot": {
                        "student_id": 201,
                        "university_email": "student201@example.edu",
                        "registered_on": "2025-01-10"
                    },
                    "via": [
                        "loan.student_id → student"
                    ]
                }
            ],
            "librarian": [
                {
                    "key": {
                        "librarian_id": 301
                    },
                    "snapshot": {
                        "librarian_id": 301,
                        "university_email": "librarian301@example.edu",
                        "display_name": "Synthetic Librarian",
                        "hired_on": "2024-06-01"
                    },
                    "via": [
                        "loan.librarian_id → librarian"
                    ]
                }
            ]
        },
        "references": {},
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "loan",
                    "key": {
                        "loan_id": 401
                    },
                    "field": "due_on",
                    "value": "2025-02-15"
                },
                {
                    "entity": "loan",
                    "key": {
                        "loan_id": 401
                    },
                    "field": "returned_on",
                    "value": null
                },
                {
                    "entity": "loan",
                    "key": {
                        "loan_id": 401
                    },
                    "field": "fine_amount",
                    "value": 0
                }
            ]
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "book_registered",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "loan",
            "key": {
                "loan_id": 402
            },
            "snapshot": {
                "loan_id": 402,
                "book_id": 102,
                "student_id": 201,
                "librarian_id": null,
                "borrowed_on": "2025-01-01",
                "due_on": "2025-01-15",
                "returned_on": "2025-01-12",
                "fine_amount": 0
            }
        },
        "embedded": {
            "book": [
                {
                    "key": {
                        "book_id": 102
                    },
                    "snapshot": {
                        "book_id": 102,
                        "isbn": "9780000000102",
                        "title": "Synthetic Data Models",
                        "author": "B. Example",
                        "publication_year": 2022
                    },
                    "via": [
                        "loan.book_id → book"
                    ]
                }
            ],
            "student": [
                {
                    "key": {
                        "student_id": 201
                    },
                    "snapshot": {
                        "student_id": 201,
                        "university_email": "student201@example.edu",
                        "registered_on": "2025-01-10"
                    },
                    "via": [
                        "loan.student_id → student"
                    ]
                }
            ],
            "librarian": []
        },
        "references": {},
        "details": {
            "channel": "web"
        }
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "student_registered",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "loan",
            "key": {
                "loan_id": 402
            },
            "snapshot": {
                "loan_id": 402,
                "book_id": 102,
                "student_id": 201,
                "librarian_id": null,
                "borrowed_on": "2025-01-01",
                "due_on": "2025-01-15",
                "returned_on": "2025-01-12",
                "fine_amount": 0
            }
        },
        "embedded": {
            "book": [
                {
                    "key": {
                        "book_id": 102
                    },
                    "snapshot": {
                        "book_id": 102,
                        "isbn": "9780000000102",
                        "title": "Synthetic Data Models",
                        "author": "B. Example",
                        "publication_year": 2022
                    },
                    "via": [
                        "loan.book_id → book"
                    ]
                }
            ],
            "student": [
                {
                    "key": {
                        "student_id": 201
                    },
                    "snapshot": {
                        "student_id": 201,
                        "university_email": "student201@example.edu",
                        "registered_on": "2025-01-10"
                    },
                    "via": [
                        "loan.student_id → student"
                    ]
                }
            ],
            "librarian": []
        },
        "references": {},
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "loan",
                    "key": {
                        "loan_id": 402
                    },
                    "field": "due_on",
                    "value": "2025-01-15"
                },
                {
                    "entity": "loan",
                    "key": {
                        "loan_id": 402
                    },
                    "field": "returned_on",
                    "value": "2025-01-12"
                },
                {
                    "entity": "loan",
                    "key": {
                        "loan_id": 402
                    },
                    "field": "fine_amount",
                    "value": 0
                }
            ]
        }
    }
]));
  await db.getCollection("library_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("library_events").find({"eventType":"book_registered"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("library_events").find({"source.key.loan_id":401}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("library_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("library_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("library_events").insertOne({...{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "book_registered",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "loan",
        "key": {
            "loan_id": 401
        },
        "snapshot": {
            "loan_id": 401,
            "book_id": 101,
            "student_id": 201,
            "librarian_id": 301,
            "borrowed_on": "2025-02-01",
            "due_on": "2025-02-15",
            "returned_on": null,
            "fine_amount": 0
        }
    },
    "embedded": {
        "book": [
            {
                "key": {
                    "book_id": 101
                },
                "snapshot": {
                    "book_id": 101,
                    "isbn": "9780000000101",
                    "title": "Synthetic Library Systems",
                    "author": "A. Example",
                    "publication_year": 2020
                },
                "via": [
                    "loan.book_id → book"
                ]
            }
        ],
        "student": [
            {
                "key": {
                    "student_id": 201
                },
                "snapshot": {
                    "student_id": 201,
                    "university_email": "student201@example.edu",
                    "registered_on": "2025-01-10"
                },
                "via": [
                    "loan.student_id → student"
                ]
            }
        ],
        "librarian": [
            {
                "key": {
                    "librarian_id": 301
                },
                "snapshot": {
                    "librarian_id": 301,
                    "university_email": "librarian301@example.edu",
                    "display_name": "Synthetic Librarian",
                    "hired_on": "2024-06-01"
                },
                "via": [
                    "loan.librarian_id → librarian"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("library_events").insertOne({
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "book_registered",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "loan",
        "key": {
            "loan_id": 401
        },
        "snapshot": {
            "loan_id": 401,
            "book_id": 101,
            "student_id": 201,
            "librarian_id": 301,
            "borrowed_on": "2025-02-01",
            "due_on": "2025-02-15",
            "returned_on": null,
            "fine_amount": 0
        }
    },
    "embedded": {
        "book": [
            {
                "key": {
                    "book_id": 101
                },
                "snapshot": {
                    "book_id": 101,
                    "isbn": "9780000000101",
                    "title": "Synthetic Library Systems",
                    "author": "A. Example",
                    "publication_year": 2020
                },
                "via": [
                    "loan.book_id → book"
                ]
            }
        ],
        "student": [
            {
                "key": {
                    "student_id": 201
                },
                "snapshot": {
                    "student_id": 201,
                    "university_email": "student201@example.edu",
                    "registered_on": "2025-01-10"
                },
                "via": [
                    "loan.student_id → student"
                ]
            }
        ],
        "librarian": [
            {
                "key": {
                    "librarian_id": 301
                },
                "snapshot": {
                    "librarian_id": 301,
                    "university_email": "librarian301@example.edu",
                    "display_name": "Synthetic Librarian",
                    "hired_on": "2024-06-01"
                },
                "via": [
                    "loan.librarian_id → librarian"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("library_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
