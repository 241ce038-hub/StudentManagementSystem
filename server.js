const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


// ============================================
// MYSQL CONNECTION
// ============================================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_management"
});


// ============================================
// CONNECT MYSQL
// ============================================

db.connect((err) => {

    if (err) {
        console.log("MySQL connection failed!");
        console.log(err);
    } else {
        console.log("MySQL connected successfully!");
    }

});


// ============================================
// GET ALL STUDENTS
// ============================================

app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM students ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch students"
            });
        }

        res.json(results);

    });

});


// ============================================
// ADD STUDENT
// ============================================

app.post("/api/students", (req, res) => {

    const {
        name,
        email,
        department,
        phone,
        marks,
        attendance
    } = req.body;


    if (
        !name ||
        !email ||
        !department ||
        !phone ||
        marks === undefined ||
        attendance === undefined
    ) {

        return res.status(400).json({
            message: "Please fill all fields"
        });

    }


    const sql = `
        INSERT INTO students
        (name, email, department, phone, marks, attendance)
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            email,
            department,
            phone,
            marks,
            attendance
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Failed to add student"
                });

            }


            res.json({
                message: "Student added successfully",
                studentId: result.insertId
            });

        }
    );

});


// ============================================
// UPDATE STUDENT
// ============================================

app.put("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        department,
        phone,
        marks,
        attendance
    } = req.body;


    const sql = `
        UPDATE students
        SET
            name = ?,
            email = ?,
            department = ?,
            phone = ?,
            marks = ?,
            attendance = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            name,
            email,
            department,
            phone,
            marks,
            attendance,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Failed to update student"
                });

            }


            res.json({
                message: "Student updated successfully"
            });

        }
    );

});


// ============================================
// DELETE STUDENT
// ============================================

app.delete("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Failed to delete student"
                });

            }


            res.json({
                message: "Student deleted successfully"
            });

        }
    );

});


// ============================================
// START SERVER
// ============================================

app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});