# University Library Management System — ER diagram

```mermaid
erDiagram
    direction LR
    book {
        bigint book_id PK
        text isbn UK
        text title
        text author
        integer publication_year "Optional"
    }
    student {
        bigint student_id PK
        text university_email UK
        date registered_on
    }
    librarian {
        bigint librarian_id PK
        text university_email UK
        text display_name
        date hired_on
    }
    loan {
        bigint loan_id PK
        bigint book_id FK
        bigint student_id FK
        bigint librarian_id FK "Optional"
        date borrowed_on
        date due_on
        date returned_on "Optional"
        numeric fine_amount
    }
    book ||--o{ loan : "book_id"
    student ||--o{ loan : "student_id"
    librarian o|--o{ loan : "librarian_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Ofomata_Oluebube_301926673_ERDiagram.png)
