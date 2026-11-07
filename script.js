// STUDENT ACADEMIC REPORT SYSTEM

const app = document.getElementById("app");

let users = JSON.parse(localStorage.getItem("users")) || [
    {
        id: "2500090140",
        name: "Vishnu",
        password: "Vishnu@123",
        email: "vishnu@gmail.com",
        role: "student"
    }
];

let marks = JSON.parse(localStorage.getItem("marks")) || [
    { id: "2500090140", subject: "Mathematics", marks: 85, total: 100 },
    { id: "2500090140", subject: "Java", marks: 92, total: 100 },
    { id: "2500090140", subject: "DBMS", marks: 78, total: 100 },
    { id: "2500090140", subject: "Computer Networks", marks: 88, total: 100 }
];

let notices = JSON.parse(localStorage.getItem("notices")) || [
    { title: "Mid Examination", message: "Mid examinations start next Monday." },
    { title: "Assignment Submission", message: "Submit all assignments before Friday." }
];

let tests = JSON.parse(localStorage.getItem("tests")) || [
    { title: "Java Programming", date: "2026-11-15" },
    { title: "Mathematics", date: "2026-11-20" }
];

let attendance = JSON.parse(localStorage.getItem("attendance")) || {
    "2500090140": 92
};

let currentUser = null;
let currentMode = "student";

function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("marks", JSON.stringify(marks));
    localStorage.setItem("notices", JSON.stringify(notices));
    localStorage.setItem("tests", JSON.stringify(tests));
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// LOGIN PAGE

function showLogin() {
    app.innerHTML = `
    <div class="login-container">
        <div class="login-box">
            <div class="logo">
                <i class="fas fa-graduation-cap"></i>
                <h2>Student Portal</h2>
                <p>Student Academic Report System</p>
            </div>

            <div class="tabs">
                <button id="studentTab"
                    class="${currentMode === "student" ? "active" : ""}"
                    onclick="setMode('student')">Student</button>

                <button id="adminTab"
                    class="${currentMode === "admin" ? "active" : ""}"
                    onclick="setMode('admin')">Admin</button>
            </div>

            <form onsubmit="login(event)">
                <div class="form-group">
                    <label>${currentMode === "admin" ? "Admin ID" : "Student ID"}</label>
                    <input id="loginId" required
                        placeholder="Enter your ID">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input id="loginPassword" type="password"
                        required placeholder="Enter password">
                </div>

                <button class="primary-btn">Login
                    <i class="fas fa-arrow-right"></i>
                </button>
            </form>

            ${currentMode === "student" ? `
            <div class="switch-text">
                Don't have an account?
                <a onclick="showSignup()">Sign Up</a>
            </div>` : ""}

            <div class="demo">
                <b>Demo Credentials</b><br>
                Student ID: 2500090140<br>
                Password: Vishnu@123<br>
                Admin ID: admin<br>
                Password: Admin@123
            </div>
        </div>
    </div>`;
}

function setMode(mode) {
    currentMode = mode;
    showLogin();
}

// STUDENT SIGNUP

function showSignup() {
    app.innerHTML = `
    <div class="login-container">
        <div class="login-box">
            <div class="logo">
                <i class="fas fa-user-plus"></i>
                <h2>Create Account</h2>
                <p>Register as a student</p>
            </div>

            <form onsubmit="signup(event)">
                <div class="form-group">
                    <label>Full Name</label>
                    <input id="regName" required placeholder="Your name">
                </div>

                <div class="form-group">
                    <label>Student ID</label>
                    <input id="regId" required placeholder="Your student ID">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input id="regEmail" type="email" required placeholder="Email address">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input id="regPassword" type="password" required minlength="6"
                        placeholder="Create password">
                </div>

                <button class="primary-btn">Create Account</button>
            </form>

            <div class="switch-text">
                Already registered?
                <a onclick="showLogin()">Login</a>
            </div>
        </div>
    </div>`;
}

function signup(event) {
    event.preventDefault();

    const id = document.getElementById("regId").value.trim();

    if (users.some(user => user.id === id)) {
        alert("Student ID already exists!");
        return;
    }

    users.push({
        id,
        name: document.getElementById("regName").value.trim(),
        email: document.getElementById("regEmail").value.trim(),
        password: document.getElementById("regPassword").value,
        role: "student"
    });

    attendance[id] = 0;
    saveData();

    alert("Registration successful! Please login.");
    showLogin();
}

// LOGIN FUNCTION

function login(event) {
    event.preventDefault();

    const id = document.getElementById("loginId").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (currentMode === "admin") {
        if (id === "admin" && password === "Admin@123") {
            currentUser = {
                id: "admin",
                name: "Administrator",
                role: "admin"
            };

            showAdminDashboard();
        } else {
            alert("Invalid admin credentials!");
        }

        return;
    }

    const user = users.find(u =>
        u.id === id &&
        u.password === password &&
        u.role === "student"
    );

    if (!user) {
        alert("Invalid Student ID or Password!");
        return;
    }

    currentUser = user;
    showStudentDashboard();
}

// STUDENT DASHBOARD

function showStudentDashboard() {
    studentPage("Dashboard");
}

function studentPage(page) {
    const studentMarks = marks.filter(m => m.id === currentUser.id);

    const obtained = studentMarks.reduce((sum, m) => sum + Number(m.marks), 0);
    const maximum = studentMarks.reduce((sum, m) => sum + Number(m.total), 0);

    const percentage = maximum ? (obtained / maximum * 100).toFixed(1) : 0;
    const present = attendance[currentUser.id] || 0;

    let content = "";

    if (page === "Dashboard") {
        content = `
        <div class="cards">
            <div class="card">
                <i class="fas fa-book"></i>
                <h3>${studentMarks.length}</h3>
                <p>Total Subjects</p>
            </div>

            <div class="card">
                <i class="fas fa-chart-line"></i>
                <h3>${percentage}%</h3>
                <p>Overall Percentage</p>
            </div>

            <div class="card">
                <i class="fas fa-calendar-check"></i>
                <h3>${present}%</h3>
                <p>Attendance</p>
            </div>

            <div class="card">
                <i class="fas fa-award"></i>
                <h3>${percentage >= 40 ? "Pass" : "Fail"}</h3>
                <p>Result Status</p>
            </div>
        </div>

        <div class="panel">
            <h3>Recent Academic Results</h3>
            ${marksTable(studentMarks)}
        </div>

        <div class="panel">
            <h3>Latest Notices</h3>
            ${noticeContent()}
        </div>`;
    }

    else if (page === "Marks") {
        content = `
        <div class="panel">
            <h3>Academic Performance</h3>
            ${marksTable(studentMarks)}
            <h3 style="margin-top:20px">
                Overall Percentage: ${percentage}%
            </h3>
        </div>`;
    }

    else if (page === "Attendance") {
        content = `
        <div class="panel">
            <h3>Attendance Report</h3>
            <div class="cards">
                <div class="card">
                    <i class="fas fa-calendar-check"></i>
                    <h3>${present}%</h3>
                    <p>Attendance Percentage</p>
                </div>
                <div class="card">
                    <i class="fas fa-info-circle"></i>
                    <h3>${present >= 75 ? "Eligible" : "Shortage"}</h3>
                    <p>Attendance Status</p>
                </div>
            </div>
            <p>Minimum required attendance: 75%</p>
        </div>`;
    }

    else if (page === "Tests") {
        content = `
        <div class="panel">
            <h3>Upcoming Tests</h3>
            ${tests.length ? tests.map(t => `
                <div class="notice">
                    <h4>${escapeHTML(t.title)}</h4>
                    <p>Exam Date: ${escapeHTML(t.date)}</p>
                </div>
            `).join("") : "<p>No upcoming tests.</p>"}
        </div>`;
    }

    else if (page === "Notices") {
        content = `
        <div class="panel">
            <h3>University Notices</h3>
            ${noticeContent()}
        </div>`;
    }

    else if (page === "Profile") {
        content = `
        <div class="panel">
            <h3>Student Profile</h3>
            <p><b>Name:</b> ${escapeHTML(currentUser.name)}</p><br>
            <p><b>Student ID:</b> ${escapeHTML(currentUser.id)}</p><br>
            <p><b>Email:</b> ${escapeHTML(currentUser.email)}</p><br>
            <p><b>Role:</b> Student</p>
        </div>`;
    }

    renderLayout(page, content, false);
}

// MARKS TABLE

function marksTable(data) {
    if (!data.length) return "<p>No marks available.</p>";

    return `
    <table>
        <thead>
            <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(m => {
                const percentage = (Number(m.marks) / Number(m.total)) * 100;

                return `
                <tr>
                    <td>${escapeHTML(m.subject)}</td>
                    <td>${m.marks}</td>
                    <td>${m.total}</td>
                    <td>${percentage.toFixed(1)}%</td>
                    <td><span class="status">
                        ${percentage >= 40 ? "Pass" : "Fail"}
                    </span></td>
                </tr>`;
            }).join("")}
        </tbody>
    </table>`;
}

// NOTICES

function noticeContent() {
    if (!notices.length) return "<p>No notices available.</p>";

    return notices.map(n => `
        <div class="notice">
            <h4>${escapeHTML(n.title)}</h4>
            <p>${escapeHTML(n.message)}</p>
        </div>
    `).join("");
}

// ADMIN DASHBOARD

function showAdminDashboard() {
    adminPage("Dashboard");
}

function adminPage(page) {
    let content = "";

    if (page === "Dashboard") {
        content = `
        <div class="cards">
            <div class="card">
                <i class="fas fa-users"></i>
                <h3>${users.length}</h3>
                <p>Registered Students</p>
            </div>

            <div class="card">
                <i class="fas fa-book"></i>
                <h3>${marks.length}</h3>
                <p>Marks Records</p>
            </div>

            <div class="card">
                <i class="fas fa-file-alt"></i>
                <h3>${tests.length}</h3>
                <p>Published Tests</p>
            </div>

            <div class="card">
                <i class="fas fa-bullhorn"></i>
                <h3>${notices.length}</h3>
                <p>Notices</p>
            </div>
        </div>

        <div class="panel">
            <h3>Registered Students</h3>
            ${studentTable()}
        </div>`;
    }

    else if (page === "Manage Marks") {
        content = `
        <div class="panel">
            <h3>Add Student Marks</h3>

            <form class="admin-form" onsubmit="addMarks(event)">
                <input id="markId" placeholder="Student ID" required>
                <input id="subject" placeholder="Subject" required>
                <input id="markValue" type="number" placeholder="Marks" min="0" required>
                <input id="totalValue" type="number" placeholder="Total Marks" min="1" required>
                <button>Add Marks</button>
            </form>

            <h3>All Marks Records</h3>
            ${marksTable(marks)}
        </div>`;
    }

    else if (page === "Manage Tests") {
        content = `
        <div class="panel">
            <h3>Publish New Test</h3>

            <form class="admin-form" onsubmit="addTest(event)">
                <input id="testTitle" placeholder="Test Name" required>
                <input id="testDate" type="date" required>
                <button>Publish Test</button>
            </form>

            <h3>Published Tests</h3>
            ${tests.map((t, i) => `
                <div class="notice">
                    <h4>${escapeHTML(t.title)}</h4>
                    <p>${escapeHTML(t.date)}</p>
                    <button class="delete-btn" onclick="deleteTest(${i})">Delete</button>
                </div>
            `).join("")}
        </div>`;
    }

    else if (page === "Manage Notices") {
        content = `
        <div class="panel">
            <h3>Publish Notice</h3>

            <form class="admin-form" onsubmit="addNotice(event)">
                <input id="noticeTitle" placeholder="Notice Title" required>
                <input id="noticeMessage" placeholder="Notice Message" required>
                <button>Publish Notice</button>
            </form>

            <h3>Published Notices</h3>
            ${notices.map((n, i) => `
                <div class="notice">
                    <h4>${escapeHTML(n.title)}</h4>
                    <p>${escapeHTML(n.message)}</p>
                    <button class="delete-btn" onclick="deleteNotice(${i})">Delete</button>
                </div>
            `).join("")}
        </div>`;
    }

    else if (page === "Students") {
        content = `
        <div class="panel">
            <h3>Student Accounts</h3>
            ${studentTable()}
        </div>`;
    }

    renderLayout(page, content, true);
}

// STUDENT TABLE

function studentTable() {
    const students = users.filter(u => u.role === "student");

    if (!students.length) return "<p>No students registered.</p>";

    return `
    <table>
        <thead>
            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            ${students.map(s => `
                <tr>
                    <td>${escapeHTML(s.id)}</td>
                    <td>${escapeHTML(s.name)}</td>
                    <td>${escapeHTML(s.email)}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>`;
}

// ADMIN ACTIONS

function addMarks(event) {
    event.preventDefault();

    const id = document.getElementById("markId").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const value = Number(document.getElementById("markValue").value);
    const total = Number(document.getElementById("totalValue").value);

    if (!users.some(u => u.id === id && u.role === "student")) {
        alert("Student not found!");
        return;
    }

    if (value < 0 || total <= 0 || value > total) {
        alert("Enter valid marks and total marks.");
        return;
    }

    marks.push({
        id,
        subject,
        marks: value,
        total
    });

    saveData();
    alert("Marks added successfully!");
    adminPage("Manage Marks");
}

function addTest(event) {
    event.preventDefault();

    tests.push({
        title: document.getElementById("testTitle").value.trim(),
        date: document.getElementById("testDate").value
    });

    saveData();
    alert("Test published successfully!");
    adminPage("Manage Tests");
}

function addNotice(event) {
    event.preventDefault();

    notices.push({
        title: document.getElementById("noticeTitle").value.trim(),
        message: document.getElementById("noticeMessage").value.trim()
    });

    saveData();
    alert("Notice published successfully!");
    adminPage("Manage Notices");
}

function deleteNotice(index) {
    if (!confirm("Delete this notice?")) return;

    notices.splice(index, 1);
    saveData();
    adminPage("Manage Notices");
}

function deleteTest(index) {
    if (!confirm("Delete this test?")) return;

    tests.splice(index, 1);
    saveData();
    adminPage("Manage Tests");
}

// COMMON LAYOUT

function renderLayout(page, content, isAdmin) {
    const menu = isAdmin
        ? ["Dashboard", "Students", "Manage Marks", "Manage Tests", "Manage Notices"]
        : ["Dashboard", "Marks", "Attendance", "Tests", "Notices", "Profile"];

    app.innerHTML = `
    <div class="layout">

        <aside class="sidebar">
            <h2><i class="fas fa-graduation-cap"></i> EduPortal</h2>

            ${menu.map(item => `
                <button class="${page === item ? "active" : ""}"
                    onclick="${isAdmin ? "adminPage" : "studentPage"}('${item}')">
                    <i class="fas ${getIcon(item)}"></i>
                    ${item}
                </button>
            `).join("")}

            <button class="logout" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </aside>

        <main class="main">
            <div class="topbar">
                <div>
                    <h2>${page}</h2>
                    <p>Student Academic Report System</p>
                </div>

                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    ${escapeHTML(currentUser.name)}
                    <span>(${isAdmin ? "Admin" : "Student"})</span>
                </div>
            </div>

            ${content}
        </main>
    </div>`;
}

function getIcon(page) {
    const icons = {
        "Dashboard": "fa-chart-pie",
        "Students": "fa-users",
        "Manage Marks": "fa-book",
        "Manage Tests": "fa-file-alt",
        "Manage Notices": "fa-bullhorn",
        "Marks": "fa-chart-bar",
        "Attendance": "fa-calendar-check",
        "Tests": "fa-clipboard-list",
        "Notices": "fa-bell",
        "Profile": "fa-user"
    };

    return icons[page] || "fa-circle";
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// LOGOUT

function logout() {
    currentUser = null;
    currentMode = "student";
    showLogin();
}

// START APPLICATION

saveData();
showLogin();