# University Library Management System — database design

My case study records book, student, librarian, loan.

## Users

- Library staff registering books and students, recording loans and returns, and managing fines.
- Students searching the catalog and reviewing their loans and fines.

## Main operations

- Register books and students.
- Search books by title or ISBN.
- Record book loans and returns.
- Identify overdue loans and assess fines.

## Entities

| Entity | Information stored |
| --- | --- |
| book | A registered catalog item. |
| student | A registered library borrower. |
| librarian | A library staff member who may record a loan. |
| loan | A borrowing record, including return status and any assessed fine. |

## book

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| book_id | BIGINT | PK | Yes |
| isbn | TEXT | Unique | Yes |
| title | TEXT |  | Yes |
| author | TEXT |  | Yes |
| publication_year | INTEGER |  | No |
- Unique key: (isbn).

## student

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| student_id | BIGINT | PK | Yes |
| university_email | TEXT | Unique | Yes |
| registered_on | DATE |  | Yes |
- Unique key: (university_email).

## librarian

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| librarian_id | BIGINT | PK | Yes |
| university_email | TEXT | Unique | Yes |
| display_name | TEXT |  | Yes |
| hired_on | DATE |  | Yes |
- Unique key: (university_email).

## loan

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| loan_id | BIGINT | PK | Yes |
| book_id | BIGINT | FK | Yes |
| student_id | BIGINT | FK | Yes |
| librarian_id | BIGINT | FK | No |
| borrowed_on | DATE |  | Yes |
| due_on | DATE |  | Yes |
| returned_on | DATE |  | No |
| fine_amount | NUMERIC(18,2) |  | Yes |
- book_id → book.book_id
- student_id → student.student_id
- librarian_id → librarian.librarian_id

## Relationships and business rules

- Every registered book has a non-null ISBN that is unique among catalog records.
- Each registered student has a distinct university email address.
- Every loan refers to an existing book.
- Every loan refers to an existing student.
- A loan's optional librarian reference, when present, refers to an existing librarian.
- The due date and any recorded return date must both be strictly after the borrowing date.
- An assessed fine amount cannot be negative.
- At most one loan per book may have no return date; enforce uniqueness on book_id only for loans whose returned_on is null.

## Assumptions

- Student names and sample student IDs are intentionally omitted. Student records use synthetic identifiers and synthetic university email addresses.
- All entity primary keys are single-column synthetic identifiers drawn from one globally unique namespace.
- Each ISBN identifies one catalog record; multiple physical copies of a title are outside this exercise.
- A book can have at most one active loan. A returned book may be loaned again.
- A loan has one student and one book; its recording librarian is optional.
- Fines are nonnegative amounts in one exercise currency. Fine calculation policy is outside the exercise.
- Worked normalization example: in a loan record, loan_id determines book_id and the loan dates and fine. Book title depends on book_id, so it belongs in Book rather than being repeated on each loan. This example follows only the book relationship.
- Separate benchmark plan: generate 20,000 synthetic loan rows, compare the overdue-date filter plan before and after a B-tree index on due_on, and record query plans and measured timings without assuming an outcome.

