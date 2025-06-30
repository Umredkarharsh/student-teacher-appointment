import { db } from './firebase.js';
import {
doc,
setDoc,
serverTimestamp,
getDocs,
collection,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function initAdminPage() {
loadPendingStudents();
setupTeacherForm();
loadRegisteredTeachers(); // Add this line
}

// 🧠 Load pending students
async function loadPendingStudents() {
const container = document.getElementById("studentList");
container.innerHTML = "Loading...";

const snapshot = await getDocs(collection(db, "users"));
const students = snapshot.docs.filter(doc => doc.data().role === "student" && doc.data().approved === false);

if (students.length === 0) {
container.innerHTML = "<p>No pending students.</p>";
return;
}

container.innerHTML = "";
students.forEach(docSnap => {
const user = docSnap.data();
const div = document.createElement("div");
div.className = "student-card";
div.innerHTML = `<span><strong>${user.name}</strong> (${user.email})</span> <button onclick="approveStudent('${docSnap.id}')">Approve</button>`;
container.appendChild(div);
});
}

// ✅ Approve student (global for HTML to access)
window.approveStudent = async function (uid) {
const userRef = doc(db, "users", uid);
await updateDoc(userRef, { approved: true });
alert("Student approved.");
loadPendingStudents();
};

// ✅ Setup teacher form
function setupTeacherForm() {
const form = document.getElementById("addTeacherForm");
if (!form) return;

form.addEventListener("submit", async (e) => {
e.preventDefault();


const name = document.getElementById("teacherName").value.trim();
const email = document.getElementById("teacherEmail").value.trim();
const subject = document.getElementById("teacherSubject").value.trim();
const department = document.getElementById("teacherDepartment").value.trim();
const password = document.getElementById("teacherPassword").value.trim(); // stored for info only

const statusText = document.getElementById("teacherStatus");

try {
  const teacherRef = doc(db, "teachers", email);
  await setDoc(teacherRef, {
    name,
    email,
    subject,
    department,
    password,
    createdAt: serverTimestamp()
  });

  statusText.textContent = "✅ Teacher added to Firestore.";
  statusText.style.color = "green";
  form.reset();
} catch (error) {
  console.error("Firestore add error:", error);
  statusText.textContent = "❌ Error: " + error.message;
  statusText.style.color = "red";
}
});
}
function loadRegisteredTeachers() {
const container = document.getElementById("teacherList");
container.innerHTML = "Loading...";

getDocs(collection(db, "teachers"))
.then(snapshot => {
const teachers = snapshot.docs;


  if (teachers.length === 0) {
    container.innerHTML = "<p>No teachers registered.</p>";
    return;
  }

  container.innerHTML = "";
  teachers.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "student-card";
    div.innerHTML = `<span><strong>${data.name}</strong> (${data.email}) - ${data.subject}</span>`;
    container.appendChild(div);
  });
})
.catch(error => {
  console.error("Error loading teachers:", error);
  container.innerHTML = "<p>Error loading teachers.</p>";
});
}