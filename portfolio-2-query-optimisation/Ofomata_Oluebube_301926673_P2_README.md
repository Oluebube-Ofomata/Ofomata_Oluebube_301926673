# University Library Management System — SQL queries

## 1. Show related loan, student, book records (up to 20).

```sql
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
```

| loan_loan_id | loan_borrowed_on | student_student_id | student_university_email | book_book_id | book_isbn |
| --- | --- | --- | --- | --- | --- |
| 401 | 2025-02-01 | 201 | student201@example.edu | 101 | 9780000000101 |
| 402 | 2025-01-01 | 201 | student201@example.edu | 102 | 9780000000102 |

## 2. Find loan records where due_on matches "2025-02-15" (up to 20).

```sql
SELECT * FROM portfolio."loan"
WHERE "due_on" IS NOT DISTINCT FROM '2025-02-15'
ORDER BY "loan_id"
LIMIT 20;
```

| loan_id | book_id | student_id | librarian_id | borrowed_on | due_on | returned_on | fine_amount |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 401 | 101 | 201 | 301 | 2025-02-01 | 2025-02-15 | NULL | 0 |

## 3. Count loan records for each book_id (up to 20 groups).

```sql
SELECT "book_id", count(*) AS record_count
FROM portfolio."loan"
GROUP BY "book_id"
ORDER BY record_count DESC, "book_id" NULLS LAST
LIMIT 20;
```

| book_id | record_count |
| --- | --- |
| 101 | 1 |
| 102 | 1 |

## 4. Find book records where isbn matches "9780000000101" (up to 20).

```sql
SELECT * FROM portfolio."book"
WHERE "isbn" IS NOT DISTINCT FROM '9780000000101'
ORDER BY "book_id"
LIMIT 20;
```

| book_id | isbn | title | author | publication_year |
| --- | --- | --- | --- | --- |
| 101 | 9780000000101 | Synthetic Library Systems | A. Example | 2020 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 0.853 | 0.842, 1.459, 0.853 | Sort → Seq Scan | 112 |
| After index | 0.189 | 0.189, 0.177, 0.24 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 0.853 ms to 0.189 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=0.82..0.822 rows=20 loops=1)
  Seq Scan on loan (actual time=0.016..0.786 rows=20 loops=1)
Planning Time: 0.343 ms
Execution Time: 0.842 ms
```

### Before index, run 2

```text
Sort (actual time=1.421..1.423 rows=20 loops=1)
  Seq Scan on loan (actual time=0.023..1.369 rows=20 loops=1)
Planning Time: 0.508 ms
Execution Time: 1.459 ms
```

### Before index, run 3

```text
Sort (actual time=0.83..0.832 rows=20 loops=1)
  Seq Scan on loan (actual time=0.016..0.796 rows=20 loops=1)
Planning Time: 0.33 ms
Execution Time: 0.853 ms
```

### After index, run 1

```text
Sort (actual time=0.14..0.142 rows=20 loops=1)
  Bitmap Heap Scan on loan (actual time=0.028..0.105 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=20 loops=1)
Planning Time: 0.534 ms
Execution Time: 0.189 ms
```

### After index, run 2

```text
Sort (actual time=0.125..0.127 rows=20 loops=1)
  Bitmap Heap Scan on loan (actual time=0.028..0.088 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=20 loops=1)
Planning Time: 0.54 ms
Execution Time: 0.177 ms
```

### After index, run 3

```text
Sort (actual time=0.17..0.173 rows=20 loops=1)
  Bitmap Heap Scan on loan (actual time=0.037..0.118 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.018..0.018 rows=20 loops=1)
Planning Time: 0.788 ms
Execution Time: 0.24 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Ofomata_Oluebube_301926673_P2_Queries.sql, then Ofomata_Oluebube_301926673_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Ofomata_Oluebube_301926673_P2_QueryResults.png) · [Index comparison](screenshots/Ofomata_Oluebube_301926673_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

