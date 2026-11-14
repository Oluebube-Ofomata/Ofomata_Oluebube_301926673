-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. book pk. Expected: pk_book, SQLSTATE 23505.
INSERT INTO portfolio."book" ("book_id", "isbn", "title", "author", "publication_year")
VALUES (101, '9780000006101', 'Duplicate primary key test', 'C. Example', 2021);

-- 2. book unique. Expected: uq_book_0, SQLSTATE 23505.
INSERT INTO portfolio."book" ("book_id", "isbn", "title", "author", "publication_year")
VALUES (6001, '9780000000101', 'Duplicate ISBN test', 'C. Example', 2021);

-- 3. book isbn not null. Expected: isbn, SQLSTATE 23502.
INSERT INTO portfolio."book" ("book_id", "isbn", "title", "author", "publication_year")
VALUES (6002, NULL, 'Null ISBN test', 'C. Example', 2021);

-- 4. student pk. Expected: pk_student, SQLSTATE 23505.
INSERT INTO portfolio."student" ("student_id", "university_email", "registered_on")
VALUES (201, 'student6003@example.edu', '2025-03-01');

-- 5. student unique. Expected: uq_student_0, SQLSTATE 23505.
INSERT INTO portfolio."student" ("student_id", "university_email", "registered_on")
VALUES (6004, 'student201@example.edu', '2025-03-01');

-- 6. librarian pk. Expected: pk_librarian, SQLSTATE 23505.
INSERT INTO portfolio."librarian" ("librarian_id", "university_email", "display_name", "hired_on")
VALUES (301, 'librarian6005@example.edu', 'Duplicate primary key test', '2025-03-01');

-- 7. librarian unique. Expected: uq_librarian_0, SQLSTATE 23505.
INSERT INTO portfolio."librarian" ("librarian_id", "university_email", "display_name", "hired_on")
VALUES (6006, 'librarian301@example.edu', 'Duplicate email test', '2025-03-01');

-- 8. loan pk. Expected: pk_loan, SQLSTATE 23505.
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount")
VALUES (401, 102, 201, 301, '2025-03-01', '2025-03-15', '2025-03-10', 0);

-- 9. loan book fk. Expected: fk_loan_0, SQLSTATE 23503.
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount")
VALUES (6007, 9991, 201, 301, '2025-03-01', '2025-03-15', '2025-03-10', 0);

-- 10. loan student fk. Expected: fk_loan_1, SQLSTATE 23503.
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount")
VALUES (6008, 102, 9992, 301, '2025-03-01', '2025-03-15', '2025-03-10', 0);

-- 11. loan librarian fk. Expected: fk_loan_2, SQLSTATE 23503.
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount")
VALUES (6009, 102, 201, 9993, '2025-03-01', '2025-03-15', '2025-03-10', 0);

-- 12. loan dates check. Expected: loan_dates_valid, SQLSTATE 23514.
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount")
VALUES (6010, 102, 201, 301, '2025-03-15', '2025-03-15', NULL, 0);

-- 13. loan fine check. Expected: loan_fine_nonnegative, SQLSTATE 23514.
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount")
VALUES (6011, 102, 201, 301, '2025-03-01', '2025-03-15', NULL, -1);

-- 14. loan active unique. Expected: active_book_loan, SQLSTATE 23505.
INSERT INTO portfolio."loan" ("loan_id", "book_id", "student_id", "librarian_id", "borrowed_on", "due_on", "returned_on", "fine_amount")
VALUES (6012, 101, 201, 301, '2025-03-01', '2025-03-15', NULL, 0);
