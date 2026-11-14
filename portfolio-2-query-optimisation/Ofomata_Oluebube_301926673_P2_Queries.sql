-- Show related loan, student, book records (up to 20).
SELECT t0."loan_id" AS "loan_loan_id",
       t0."borrowed_on" AS "loan_borrowed_on",
       t2."student_id" AS "student_student_id",
       t2."university_email" AS "student_university_email",
       t1."book_id" AS "book_book_id",
       t1."isbn" AS "book_isbn"
FROM portfolio."loan" t0
JOIN portfolio."book" t1 ON t0."book_id" = t1."book_id"
JOIN portfolio."student" t2 ON t0."student_id" = t2."student_id"
ORDER BY t0."loan_id", t2."student_id", t1."book_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."loan_id" AS "loan_loan_id",
       t0."borrowed_on" AS "loan_borrowed_on",
       t2."student_id" AS "student_student_id",
       t2."university_email" AS "student_university_email",
       t1."book_id" AS "book_book_id",
       t1."isbn" AS "book_isbn"
FROM portfolio."loan" t0
JOIN portfolio."book" t1 ON t0."book_id" = t1."book_id"
JOIN portfolio."student" t2 ON t0."student_id" = t2."student_id"
ORDER BY t0."loan_id", t2."student_id", t1."book_id"
LIMIT 20;

-- Find loan records where due_on matches "2025-02-15" (up to 20).
SELECT * FROM portfolio."loan"
WHERE "due_on" IS NOT DISTINCT FROM '2025-02-15'
ORDER BY "loan_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."loan"
WHERE "due_on" IS NOT DISTINCT FROM '2025-02-15'
ORDER BY "loan_id"
LIMIT 20;

-- Count loan records for each book_id (up to 20 groups).
SELECT "book_id", count(*) AS record_count
FROM portfolio."loan"
GROUP BY "book_id"
ORDER BY record_count DESC, "book_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "book_id", count(*) AS record_count
FROM portfolio."loan"
GROUP BY "book_id"
ORDER BY record_count DESC, "book_id" NULLS LAST
LIMIT 20;

-- Find book records where isbn matches "9780000000101" (up to 20).
SELECT * FROM portfolio."book"
WHERE "isbn" IS NOT DISTINCT FROM '9780000000101'
ORDER BY "book_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."book"
WHERE "isbn" IS NOT DISTINCT FROM '9780000000101'
ORDER BY "book_id"
LIMIT 20;
