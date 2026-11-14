-- University Library Management System: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."book" (
  "book_id" bigint NOT NULL,
  "isbn" text NOT NULL,
  "title" text NOT NULL,
  "author" text NOT NULL,
  "publication_year" bigint,
  CONSTRAINT "pk_book" PRIMARY KEY ("book_id"),
  CONSTRAINT "uq_book_0" UNIQUE ("isbn")
);
CREATE TABLE portfolio."student" (
  "student_id" bigint NOT NULL,
  "university_email" text NOT NULL,
  "registered_on" date NOT NULL,
  CONSTRAINT "pk_student" PRIMARY KEY ("student_id"),
  CONSTRAINT "uq_student_0" UNIQUE ("university_email")
);
CREATE TABLE portfolio."librarian" (
  "librarian_id" bigint NOT NULL,
  "university_email" text NOT NULL,
  "display_name" text NOT NULL,
  "hired_on" date NOT NULL,
  CONSTRAINT "pk_librarian" PRIMARY KEY ("librarian_id"),
  CONSTRAINT "uq_librarian_0" UNIQUE ("university_email")
);
CREATE TABLE portfolio."loan" (
  "loan_id" bigint NOT NULL,
  "book_id" bigint NOT NULL,
  "student_id" bigint NOT NULL,
  "librarian_id" bigint,
  "borrowed_on" date NOT NULL,
  "due_on" date NOT NULL,
  "returned_on" date,
  "fine_amount" numeric(18,2) NOT NULL,
  CONSTRAINT "pk_loan" PRIMARY KEY ("loan_id")
);
ALTER TABLE portfolio."loan" ADD CONSTRAINT "fk_loan_0" FOREIGN KEY ("book_id") REFERENCES portfolio."book" ("book_id");
ALTER TABLE portfolio."loan" ADD CONSTRAINT "fk_loan_1" FOREIGN KEY ("student_id") REFERENCES portfolio."student" ("student_id");
ALTER TABLE portfolio."loan" ADD CONSTRAINT "fk_loan_2" FOREIGN KEY ("librarian_id") REFERENCES portfolio."librarian" ("librarian_id");
ALTER TABLE portfolio."loan" ADD CONSTRAINT "loan_dates_valid" CHECK (("due_on" > "borrowed_on") AND (("returned_on" IS NULL) OR ("returned_on" > "borrowed_on")));
ALTER TABLE portfolio."loan" ADD CONSTRAINT "loan_fine_nonnegative" CHECK ("fine_amount" >= 0);
CREATE UNIQUE INDEX "active_book_loan" ON portfolio."loan" ("book_id") WHERE ("returned_on" IS NULL);
COMMIT;
