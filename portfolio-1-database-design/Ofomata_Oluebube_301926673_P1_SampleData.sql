-- Fictional sample records for University Library Management System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."book" ("book_id", "isbn", "title", "author", "publication_year") VALUES (101, '9780000000101', 'Synthetic Library Systems', 'A. Example', 2020);
INSERT INTO portfolio."book" ("book_id", "isbn", "title", "author", "publication_year") VALUES (102, '9780000000102', 'Synthetic Data Models', 'B. Example', 2022);
INSERT INTO portfolio."student" ("student_id", "university_email", "registered_on") VALUES (201, 'student201@example.edu', '2025-01-10');
INSERT INTO portfolio."librarian" ("librarian_id", "university_email", "display_name", "hired_on") VALUES (301, 'librarian301@example.edu', 'Synthetic Librarian', '2024-06-01');
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount") VALUES (401, 101, 201, 301, '2025-02-01', '2025-02-15', NULL, 0);
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount") VALUES (402, 102, 201, NULL, '2025-01-01', '2025-01-15', '2025-01-12', 0);
COMMIT;
