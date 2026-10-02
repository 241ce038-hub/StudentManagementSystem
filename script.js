/* =====================================
   GLOBAL VARIABLES
===================================== */

let students = [];

let courses = JSON.parse(
    localStorage.getItem("courses")
) || [
    {
        name: "Computer Science",
        code: "CS101"
    },
    {
        name: "Artificial Intelligence",
        code: "AI101"
    },
    {
        name: "Data Science",
        code: "DS101"
    }
];



/* =====================================
   DOM ELEMENTS
===================================== */

const studentForm =
    document.getElementById("studentForm");

const studentTableBody =
    document.getElementById("studentTableBody");

const totalStudents =
    document.getElementById("totalStudents");

const totalCourses =
    document.getElementById("totalCourses");

const dashboardAttendance =
    document.getElementById("dashboardAttendance");

const searchInput =
    document.getElementById("searchInput");

const courseForm =
    document.getElementById("courseForm");

const courseTableBody =
    document.getElementById("courseTableBody");



/* =====================================
   SHOW SECTION
===================================== */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");


    sections.forEach(function(section) {

        section.style.display = "none";

    });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.style.display = "block";

    }


    /* Active sidebar link */

    const links =
        document.querySelectorAll(".sidebar a");


    links.forEach(function(link) {

        link.classList.remove("active");

    });


    links.forEach(function(link) {

        if (
            link.getAttribute("onclick") &&
            link.getAttribute("onclick").includes(sectionId)
        ) {

            link.classList.add("active");

        }

    });


    /* Search box */

    if (sectionId === "studentList") {

        searchInput.style.display = "block";

    } else {

        searchInput.style.display = "none";

    }


    window.scrollTo(0, 0);
}



/* =====================================
   LOGOUT
===================================== */

function logout() {

    alert("Logout clicked");

}



/* =====================================
   LOAD STUDENTS
===================================== */

async function loadStudents() {

    try {

        const response =
            await fetch("/api/students");


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }


        students =
            await response.json();


        displayStudents(students);

        updateDashboard();

        displayAttendance();

        displayReports();


    } catch (error) {

        console.log(
            "Error loading students:",
            error
        );

    }
}



/* =====================================
   DISPLAY STUDENTS
===================================== */

function displayStudents(data) {

    studentTableBody.innerHTML = "";


    if (data.length === 0) {

        studentTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No students found
                </td>
            </tr>
        `;

    }


    data.forEach(function(student) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.marks}</td>

            <td>${student.attendance}%</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;


        studentTableBody.appendChild(row);

    });

}



/* =====================================
   UPDATE DASHBOARD
===================================== */

function updateDashboard() {

    totalStudents.textContent =
        students.length;


    totalCourses.textContent =
        courses.length;


    if (students.length === 0) {

        dashboardAttendance.textContent =
            "0%";

        return;

    }


    let total = 0;


    students.forEach(function(student) {

        total +=
            parseFloat(student.attendance) || 0;

    });


    const average =
        total / students.length;


    dashboardAttendance.textContent =
        average.toFixed(1) + "%";

}



/* =====================================
   ADD / UPDATE STUDENT
===================================== */

studentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editStudentId"
            ).value;


        const student = {

            name:
                document.getElementById("name").value,

            email:
                document.getElementById("email").value,

            department:
                document.getElementById("department").value,

            phone:
                document.getElementById("phone").value,

            marks:
                document.getElementById("marks").value,

            attendance:
                document.getElementById("attendance").value

        };


        try {

            let response;


            if (editId) {

                /* UPDATE */

                response =
                    await fetch(
                        `/api/students/${editId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(student)
                        }
                    );

            } else {

                /* ADD */

                response =
                    await fetch(
                        "/api/students",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(student)
                        }
                    );

            }


            const result =
                await response.json();


            alert(result.message);


            studentForm.reset();


            document.getElementById(
                "editStudentId"
            ).value = "";


            document.getElementById(
                "studentFormTitle"
            ).textContent =
                "Add Student";


            document.getElementById(
                "saveStudentBtn"
            ).textContent =
                "Add Student";


            document.getElementById(
                "cancelEditBtn"
            ).style.display =
                "none";


            await loadStudents();


            showSection("studentList");


        } catch (error) {

            console.log(
                "Error saving student:",
                error
            );

            alert(
                "Something went wrong!"
            );

        }

    }
);



/* =====================================
   EDIT STUDENT
===================================== */

function editStudent(id) {

    const student =
        students.find(function(item) {

            return item.id == id;

        });


    if (!student) {

        return;

    }


    document.getElementById(
        "editStudentId"
    ).value =
        student.id;


    document.getElementById(
        "name"
    ).value =
        student.name;


    document.getElementById(
        "email"
    ).value =
        student.email;


    document.getElementById(
        "department"
    ).value =
        student.department;


    document.getElementById(
        "phone"
    ).value =
        student.phone;


    document.getElementById(
        "marks"
    ).value =
        student.marks;


    document.getElementById(
        "attendance"
    ).value =
        parseFloat(student.attendance) || 0;


    document.getElementById(
        "studentFormTitle"
    ).textContent =
        "Edit Student";


    document.getElementById(
        "saveStudentBtn"
    ).textContent =
        "Update Student";


    document.getElementById(
        "cancelEditBtn"
    ).style.display =
        "block";


    showSection("addStudent");

}



/* =====================================
   CANCEL EDIT
===================================== */

function cancelEdit() {

    studentForm.reset();


    document.getElementById(
        "editStudentId"
    ).value = "";


    document.getElementById(
        "studentFormTitle"
    ).textContent =
        "Add Student";


    document.getElementById(
        "saveStudentBtn"
    ).textContent =
        "Add Student";


    document.getElementById(
        "cancelEditBtn"
    ).style.display =
        "none";

}



/* =====================================
   DELETE STUDENT
===================================== */

async function deleteStudent(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmation) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        alert(result.message);


        await loadStudents();


    } catch (error) {

        console.log(
            "Error deleting student:",
            error
        );

    }

}



/* =====================================
   SEARCH STUDENT
===================================== */

searchInput.addEventListener(
    "input",
    function() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredStudents =
            students.filter(function(student) {

                return student.name
                    .toLowerCase()
                    .includes(searchText);

            });


        displayStudents(
            filteredStudents
        );

    }
);



/* =====================================
   COURSES
===================================== */

function displayCourses() {

    courseTableBody.innerHTML = "";


    courses.forEach(
        function(course, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>${course.name}</td>

                <td>${course.code}</td>

                <td>

                    <button
                        class="course-delete-btn"
                        onclick="deleteCourse(${index})"
                    >
                        Delete
                    </button>

                </td>

            `;


            courseTableBody.appendChild(row);

        }
    );


    localStorage.setItem(
        "courses",
        JSON.stringify(courses)
    );


    updateDashboard();

}



/* =====================================
   ADD COURSE
===================================== */

courseForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const courseName =
            document.getElementById(
                "courseName"
            ).value.trim();


        const courseCode =
            document.getElementById(
                "courseCode"
            ).value.trim();


        courses.push({

            name: courseName,

            code: courseCode

        });


        courseForm.reset();


        displayCourses();


        alert(
            "Course added successfully!"
        );

    }
);



/* =====================================
   DELETE COURSE
===================================== */

function deleteCourse(index) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this course?"
        );


    if (!confirmation) {

        return;

    }


    courses.splice(index, 1);


    displayCourses();

}



/* =====================================
   ATTENDANCE
===================================== */

function displayAttendance() {

    const tableBody =
        document.getElementById(
            "attendanceTableBody"
        );


    const overall =
        document.getElementById(
            "overallAttendance"
        );


    const above =
        document.getElementById(
            "aboveAttendance"
        );


    const below =
        document.getElementById(
            "belowAttendance"
        );


    tableBody.innerHTML = "";


    if (students.length === 0) {

        overall.textContent = "0%";

        above.textContent = "0";

        below.textContent = "0";

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No student data available
                </td>
            </tr>
        `;

        return;

    }


    let totalAttendance = 0;

    let above75 = 0;

    let below75 = 0;


    students.forEach(
        function(student) {

            const attendance =
                parseFloat(
                    student.attendance
                ) || 0;


            totalAttendance +=
                attendance;


            if (attendance >= 75) {

                above75++;

            } else {

                below75++;

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${student.department}</td>

                <td>${attendance}%</td>

            `;


            tableBody.appendChild(row);

        }
    );


    const average =
        totalAttendance /
        students.length;


    overall.textContent =
        average.toFixed(1) + "%";


    above.textContent =
        above75;


    below.textContent =
        below75;

}



/* =====================================
   REPORTS
===================================== */

function displayReports() {

    const totalStudentsReport =
        document.getElementById(
            "reportTotalStudents"
        );


    const averageMarks =
        document.getElementById(
            "averageMarks"
        );


    const averageAttendance =
        document.getElementById(
            "averageAttendance"
        );


    const reportTableBody =
        document.getElementById(
            "reportTableBody"
        );


    totalStudentsReport.textContent =
        students.length;


    reportTableBody.innerHTML = "";


    if (students.length === 0) {

        averageMarks.textContent =
            "0";


        averageAttendance.textContent =
            "0%";


        reportTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No report data available
                </td>
            </tr>
        `;

        return;

    }


    let totalMarks = 0;

    let totalAttendance = 0;


    students.forEach(
        function(student) {

            const marks =
                parseFloat(student.marks) || 0;


            const attendance =
                parseFloat(
                    student.attendance
                ) || 0;


            totalMarks += marks;

            totalAttendance +=
                attendance;


            let status;


            if (marks >= 50) {

                status = "Pass";

            } else {

                status = "Fail";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${marks}</td>

                <td>${attendance}%</td>

                <td>${status}</td>

            `;


            reportTableBody.appendChild(row);

        }
    );


    const avgMarks =
        totalMarks /
        students.length;


    const avgAttendance =
        totalAttendance /
        students.length;


    averageMarks.textContent =
        avgMarks.toFixed(1);


    averageAttendance.textContent =
        avgAttendance.toFixed(1) + "%";

}



/* =====================================
   INITIALIZE
===================================== */

displayCourses();

loadStudents();

showSection("dashboard");