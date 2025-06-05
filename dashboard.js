import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  collection, doc, addDoc, getDoc, setDoc, deleteDoc,
  query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";


const form = document.getElementById("expenseForm");
const totalAmountEl = document.getElementById("totalAmount");
const categoryFilter = document.getElementById("filterCategory");
const dateFilter = document.getElementById("filterDate");
const applyFilter = document.getElementById("applyFilter");
const showBtn = document.getElementById("showExpenses");
const tableBody = document.getElementById("expenseTableBody");
const tableContainer = document.querySelector(".table-container");

let uid = null;
let allDocs = [];
let tableVisible = false;

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";
  uid = user.uid;

  const q = query(collection(db, "users", uid, "expenses"), orderBy("created", "desc"));
  onSnapshot(q, snapshot => {
    allDocs = [];
    snapshot.forEach(docSnap => {
      allDocs.push({ id: docSnap.id, data: docSnap.data() });
    });

    updateTotalAmount();

    if (tableVisible) {
      renderExpenses();
    }
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value;
    const id = document.getElementById("expenseId").value;

    const expense = { amount, category, date, note, created: serverTimestamp() };

    if (id) {
      await setDoc(doc(db, "users", uid, "expenses", id), expense);
    } else {
      await addDoc(collection(db, "users", uid, "expenses"), expense);
    }
    form.reset();
    document.getElementById("expenseId").value = "";
    document.getElementById("category").selectedIndex = 0;
  });

  showBtn.addEventListener("click", () => {
    tableVisible = !tableVisible;

    if (tableVisible) {
      tableContainer.style.display = "block";
      showBtn.textContent = "Hide Expenses";
      renderExpenses();
    } else {
      tableContainer.style.display = "none";
      showBtn.textContent = "Show Expenses";
    }
  });

  applyFilter.addEventListener("click", (e) => {
    e.preventDefault();  
    updateTotalAmount();
    if (tableVisible) {
      renderExpenses();
    }
  });
  document.getElementById("logout").addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "index.html");
  });
});

function updateTotalAmount() {
  const categoryVal = categoryFilter.value.toLowerCase();
  const dateVal = dateFilter.value;
  let total = 0;

  allDocs.forEach(({ data }) => {
    const matchesCategory = !categoryVal || data.category.toLowerCase().includes(categoryVal);
    const matchesDate = !dateVal || data.date === dateVal;

    if (matchesCategory && matchesDate) {
      total += data.amount;
    }
  });

  totalAmountEl.textContent = total.toFixed(2);
}

function renderExpenses() {
  const categoryVal = categoryFilter.value.toLowerCase();
  const dateVal = dateFilter.value;
  tableBody.innerHTML = "";

  allDocs.forEach(({ id, data }) => {
    const matchesCategory = !categoryVal || data.category.toLowerCase().includes(categoryVal);
    const matchesDate = !dateVal || data.date === dateVal;

    if (matchesCategory && matchesDate) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>₹${data.amount.toFixed(2)}</td>
        <td>${data.category}</td>
        <td>${data.date}</td>
        <td>${data.note || ""}</td>
        <td>
          <button onclick="editExpense('${id}')">Edit</button>
          <button onclick="deleteExpense('${id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });
}

window.deleteExpense = async (id) => {
  await deleteDoc(doc(db, "users", uid, "expenses", id));
};

window.editExpense = async (id) => {
  const docRef = doc(db, "users", uid, "expenses", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  document.getElementById("amount").value = data.amount;
  document.getElementById("category").value = data.category;
  document.getElementById("date").value = data.date;
  document.getElementById("note").value = data.note;
  document.getElementById("expenseId").value = id;
};
