const firebaseConfig = {
  apiKey: "AIzaSyCLLxGoXKHON91hM4VlztO_Bme4L2UFxz4",
  authDomain: "heneza-6e5c4.firebaseapp.com",
  projectId: "heneza-6e5c4",
  storageBucket: "heneza-6e5c4.appspot.com",
  messagingSenderId: "1076999155269",
  appId: "1:1076999155269:web:e0b9faef9b0cecb3f97d2c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// رمز و ایمیل ثابت
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "123456";

// ورود
function login() {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadProducts();
  } else {
    document.getElementById("loginError").textContent = "ایمیل یا رمز اشتباه است.";
  }
}

// افزودن محصول
document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addProductForm");

  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("productName").value;
      const description = document.getElementById("productDescription").value;
      const price = parseInt(document.getElementById("productPrice").value);
      const image = document.getElementById("productImage").value;

      if (!name  !description  !price || !image) {
        alert("لطفاً همه فیلدها را پر کنید.");
        return;
      }

      await db.collection("products").add({ name, description, price, image });
      addForm.reset();
      loadProducts();
    });
  }

  // صفحه اصلی
  const container = document.getElementById("product-container");
  if (container) {
    db.collection("products").onSnapshot(snapshot => {
      container.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = 
          <img src="${d.image}" alt="${d.name}">
          <h3>${d.name}</h3>
          <p>${d.description}</p>
          <p><strong>${d.price.toLocaleString()} تومان</strong></p>
        ;
        container.appendChild(card);
      });
    });
  }
});

// نمایش محصولات در پنل
function loadProducts() {
  const list = document.getElementById("product-list");
  if (list) {
    db.collection("products").onSnapshot(snapshot => {
      list.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = 
          <img src="${d.image}" alt="${d.name}">
          <h3>${d.name}</h3>
          <p>${d.description}</p>
          <p><strong>${d.price.toLocaleString()} تومان</strong></p>
          <button onclick="deleteProduct('${doc.id}')">حذف</button>
        ;
        list.appendChild(card);
      });
    });
  }
}

// حذف محصول
function deleteProduct(id) {
  if (confirm("مطمئنید می‌خواهید حذف کنید؟")) {
    db.collection("products").doc(id).delete();
  }
}
