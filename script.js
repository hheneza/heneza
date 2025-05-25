// تنظیمات Firebase
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

// اطلاعات ورود مدیر (ثابت)
const ADMIN_EMAIL = "admin@heneza.ir";
const ADMIN_PASSWORD = "123456";

// ورود به پنل مدیریت
function login() {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadProducts();
  } else {
    document.getElementById("loginError").textContent = "اطلاعات ورود اشتباه است.";
  }
}

// افزودن محصول جدید
function addProduct() {
  const name = document.getElementById("productName").value;
  const description = document.getElementById("productDescription").value;
  const price = parseInt(document.getElementById("productPrice").value);
  const image = document.getElementById("productImage").value;

  if (!name  !description  !price || !image) {
    alert("همه فیلدها را پر کنید");
    return;
  }

  db.collection("products").add({ name, description, price, image }).then(() => {
    loadProducts();
    document.getElementById("productName").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
  });
}

// نمایش محصولات
function loadProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  db.collection("products").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = 
        <img src="${data.image}" alt="${data.name}">
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <p><strong>${data.price.toLocaleString()} تومان</strong></p>
        <button onclick="deleteProduct('${doc.id}')">حذف</button>
      ;
      container.appendChild(card);
    });
  });
}

// حذف محصول
function deleteProduct(id) {
  if (confirm("آیا از حذف محصول مطمئن هستید؟")) {
    db.collection("products").doc(id).delete().then(loadProducts);
  }
}