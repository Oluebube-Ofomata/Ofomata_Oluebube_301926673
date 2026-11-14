# University Library Management System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| book_id | loan records (list) |
| --- | --- |
| 101 | [401] |
| 102 | [402] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| loan.loan_id | loan.book_id | loan.student_id | loan.librarian_id | book.book_id | book.isbn | student.student_id | student.university_email |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 401 | 101 | 201 | 301 | 101 | 9780000000101 | 201 | student201@example.edu |
| 402 | 102 | 201 | NULL | 102 | 9780000000102 | 201 | student201@example.edu |

Key: loan_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## loan_example

| loan.loan_id | loan.book_id | loan.student_id | loan.librarian_id | book.book_id | book.isbn | student.student_id | student.university_email |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 401 | 101 | 201 | 301 | 101 | 9780000000101 | 201 | student201@example.edu |
| 402 | 102 | 201 | NULL | 102 | 9780000000102 | 201 | student201@example.edu |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## book

| book_id | isbn | title | author | publication_year |
| --- | --- | --- | --- | --- |
| 101 | 9780000000101 | Synthetic Library Systems | A. Example | 2020 |
| 102 | 9780000000102 | Synthetic Data Models | B. Example | 2022 |

## student

| student_id | university_email | registered_on |
| --- | --- | --- |
| 201 | student201@example.edu | 2025-01-10 |

## librarian

| librarian_id | university_email | display_name | hired_on |
| --- | --- | --- | --- |
| 301 | librarian301@example.edu | Synthetic Librarian | 2024-06-01 |

## loan

| loan_id | book_id | student_id | librarian_id | borrowed_on | due_on | returned_on | fine_amount |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 401 | 101 | 201 | 301 | 2025-02-01 | 2025-02-15 | NULL | 0 |
| 402 | 102 | 201 | NULL | 2025-01-01 | 2025-01-15 | 2025-01-12 | 0 |

## Dependencies

- book: (book_id) → isbn, title, author, publication_year
- student: (student_id) → university_email, registered_on
- librarian: (librarian_id) → university_email, display_name, hired_on
- loan: (loan_id) → book_id, student_id, librarian_id, borrowed_on, due_on, returned_on, fine_amount

Joining the decomposed sample tables reproduces the original 2 example rows. The design assumes the declared keys describe the relevant business dependencies.
