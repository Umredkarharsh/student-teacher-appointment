import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const uid = cred.user.uid;
      return setDoc(doc(db, "users", uid), {
        name,
        email,
        role: "student",
        approved: false,
        createdAt: serverTimestamp()
      });
    })
    .then(() => {
      alert("Signup successful! Wait for admin approval.");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Signup failed:", error);
      alert("Signup failed: " + error.message);
    });
}

export function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(async (cred) => {
      const uid = cred.user.uid;
      console.log("✅ Firebase login successful. UID:", uid);

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("❌ Firestore document not found for UID:", uid);
        alert("User not found in database.");
        return;
      }

      const data = docSnap.data();
      console.log("📌 Raw Firestore data:", data);

      const role = (data.role || "").toLowerCase();
      const approved = data.approved === true;

      console.log("✅ Extracted role:", role);
      console.log("✅ Extracted approved:", approved);

      if (role === "admin") {
        console.log("🎉 Redirecting to admin dashboard...");
        window.location.href = "dashboard/admin.html";
      } else if (role === "teacher" && approved) {
        console.log("🎉 Redirecting to teacher dashboard...");
        window.location.href = "dashboard/teacher.html";
      } else if (role === "student" && approved) {
        console.log("🎉 Redirecting to student dashboard...");
        window.location.href = "dashboard/student.html";
      } else {
        console.warn("❌ Role matched but not approved OR unrecognized role.");
        alert("Access denied or not approved yet.");
      }
    })
    .catch((error) => {
      console.error("🔥 Login error:", error);
      alert("Login failed: " + error.message);
    });
}





