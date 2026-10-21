// Firebase project settings for the online reader (read.html) and admin panel (admin.html).
// Fill these in once, following SETUP.md. These values are safe to keep public:
// who can read what is enforced by firestore.rules, not by hiding this file.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// The email Adeel Sir uses to log in to admin.html. Must match ADMIN_EMAIL in firestore.rules.
export const ADMIN_EMAIL = "";

// Student login IDs are turned into emails behind the scenes: "rahul11" -> "rahul11@<LOGIN_DOMAIN>".
// No mail is ever sent to these addresses. Don't change this after students are created.
export const LOGIN_DOMAIN = "students.chemophile.app";

// Full address of read.html once the site is live, used in the message sent to students.
// Example: "https://adeel1030.github.io/Chemo/read.html"
export const READER_URL = "";
