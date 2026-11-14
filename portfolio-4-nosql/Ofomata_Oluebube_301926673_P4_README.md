# Portfolio 4 — NoSQL and Advanced Data Models

I used the MongoDB collection library_events to store four fictional loan-related event documents. Each document is anchored to a loan record and embeds snapshots of its related book, student and, when present, librarian. The eventType values book_registered and student_registered are illustrative labels in this generated test data; they do not represent actual registration events. The source.entity is loan, so these labels should not be interpreted as verified business events.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | Illustrative test label; not a claim that a book or student registration occurred |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related book, student and librarian details are stored as snapshots with the loan-anchored document. This makes the document readable in one place. It duplicates some information, and later SQL changes do not automatically update the snapshots. The two eventType labels are used only to demonstrate filtering and grouping; because each source is a loan, they are not evidence of real book or student registration. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
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
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("library_events").find({"eventType":"book_registered"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "book_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "loan_id": 401
    }
  },
  {
    "_id": "event_000003",
    "eventType": "book_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "loan_id": 402
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("library_events").find({"source.key.loan_id":401}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "book_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "loan_id": 401
    }
  },
  {
    "_id": "event_000002",
    "eventType": "student_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "loan_id": 401
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("library_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "book_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "loan_id": 401
    }
  },
  {
    "_id": "event_000002",
    "eventType": "student_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "loan_id": 401
    }
  },
  {
    "_id": "event_000003",
    "eventType": "book_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "loan_id": 402
    }
  },
  {
    "_id": "event_000004",
    "eventType": "student_registered",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "loan_id": 402
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("library_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| book_registered | 2 |
| student_registered | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across the illustrative event labels, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record. In a production system, eventType should be renamed to a genuine loan lifecycle event and emitted only when that action actually occurs.

## Run the script

Connect mongosh to a fresh exercise database and run Ofomata_Oluebube_301926673_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Ofomata_Oluebube_301926673_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

