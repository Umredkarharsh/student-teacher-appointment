import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const teacherSelect = document.getElementById("teacherSelect");
const appointmentForm = document.getElementById("appointmentForm");
const statusMsg = document.getElementById("statusMsg");

let currentStudent = null;

// Check if user is logged in and get student data
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please login first.");
    window.location.href = "../login.html";
    return;
  }

  const studentSnap = await getDoc(doc(db, "users", user.uid));
  currentStudent = {
    id: user.uid,
    name: studentSnap.data().name || "Student",
    email: studentSnap.data().email
  };

  loadTeachers();
});

// Load teachers into the dropdown
async function loadTeachers() {
  const snapshot = await getDocs(collection(db, "teachers"));
  snapshot.forEach(docSnap => {
    const t = docSnap.data();
    const opt = document.createElement("option");
    opt.value = t.email;
    opt.textContent = `${t.name} (${t.subject})`;
    teacherSelect.appendChild(opt);
  });
}

// Handle appointment form submission
appointmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const teacherEmail = teacherSelect.value;
  const datetime = document.getElementById("appointmentDate").value;
  const message = document.getElementById("message").value.trim();

  if (!teacherEmail || !datetime || !message) {
    statusMsg.textContent = "All fields are required.";
    statusMsg.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "appointments"), {
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      teacherEmail,
      datetime,
      message,
      status: "pending",
      createdAt: serverTimestamp()
    });

    statusMsg.textContent = "✅ Appointment request sent!";
    statusMsg.style.color = "green";
    appointmentForm.reset();
  } catch (err) {
    console.error("Appointment error:", err);
    statusMsg.textContent = "❌ Failed to request appointment.";
    statusMsg.style.color = "red";
  }
});

// Handle logout
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../login.html";
  });
});
