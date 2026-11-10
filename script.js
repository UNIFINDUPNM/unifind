
// SAMPLE PRODUCTS
let products = [
    {
        name: "Oversized T-Shirt",
        category: "Fashion",
        price: 25,
        description: "best do.",
        seller: "Aiman",
        emoji: "👕"
    },
    {
        name: "Homemade Sandwich",
        category: "Food",
        price: 5,
        description: "Fresh sandwich, made daily.",
        seller: "Sarah",
        emoji: "🥪"
    },
    {
        name: "Engineering Mathematics",
        category: "Books",
        price: 18,
        description: "Secondhand textbook, good condition.",
        seller: "Hakim",
        emoji: "📚"
    },
    {
        name: "Assignment Printing",
        category: "Services",
        price: 2,
        description: "Affordable printing service.",
        seller: "Farah",
        emoji: "🖨️"
    },
    {
        name: "Preloved Backpack",
        category: "Preloved",
        price: 30,
        description: "Used backpack in good condition.",
        seller: "Amir",
        emoji: "🎒"
    },
    {
        name: "Mini Desk Lamp",
        category: "Others",
        price: 15,
        description: "Perfect for hostel study tables.",
        seller: "Nadia",
        emoji: "💡"
    }
];

// LOAD SAVED PRODUCTS
products = JSON.parse(
    localStorage.getItem("unifindProducts")
) || products;

// SAVE PRODUCTS
function saveProducts() {
    localStorage.setItem(
        "unifindProducts",
        JSON.stringify(products)
    );
}


// DISPLAY PRODUCTS

function displayProducts(items) {
    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    if (items.length === 0) {
        productList.innerHTML =
            '<p class="empty-message">No products found.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("div");
image.className = "product-image";

if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.background = "#e9eef5";

    image.appendChild(img);
} else {
    image.textContent = product.emoji || "🛍️";
}

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const price = document.createElement("div");
        price.className = "product-price";
        price.textContent = "RM " + Number(product.price).toFixed(2);

        const seller = document.createElement("div");
        seller.className = "seller-name";
        seller.textContent = "Listed by " + product.seller;

        const wishlistButton = document.createElement("button");
        wishlistButton.className = "wishlist-btn";
        wishlistButton.textContent = "❤️ Add to Wishlist";

        wishlistButton.addEventListener("click", function(event) {
            event.stopPropagation();
            toggleWishlist(product);
        });

        info.append(category, name, description, price, seller);
        card.append(image, info, wishlistButton);

        card.addEventListener("click", function() {
            openProduct(product);
        });

        productList.appendChild(card);
    });
}


// WISHLIST FUNCTIONS

function getWishlistKey() {
    const user = getCurrentUser();

    if (!user) return null;

    return "unifindWishlist_" + user.email.toLowerCase();
}


function getWishlist() {
    const key = getWishlistKey();

    if (!key) return [];

    return JSON.parse(localStorage.getItem(key)) || [];
}


function toggleWishlist(product) {
    const key = getWishlistKey();

    if (!key) {
        alert("Please login to use Wishlist.");
        return;
    }

    let wishlist = getWishlist();

    const productKey = JSON.stringify(product);

    const existingIndex = wishlist.findIndex(item =>
        JSON.stringify(item) === productKey
    );

    if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);
        alert("Product removed from Wishlist.");
    } else {
        wishlist.push(product);
        alert("Product added to Wishlist!");
    }

    localStorage.setItem(key, JSON.stringify(wishlist));

    renderWishlist();
}


function renderWishlist() {
    const wishlistContainer =
        document.getElementById("wishlistProducts");

    if (!wishlistContainer) return;

    const wishlist = getWishlist();

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistContainer.textContent =
            "Your Wishlist is empty.";
        return;
    }

    wishlist.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "dashboard-card";

        card.innerHTML = `
            <div style="font-size:35px">${product.emoji || "🛍️"}</div>
            <p>${product.category}</p>
            <h4></h4>
            <div class="dashboard-price"></div>
            <p></p>
            <button class="delete-btn">Remove ❤️</button>
        `;

        card.querySelector("h4").textContent = product.name;
        card.querySelector(".dashboard-price").textContent =
            "RM " + Number(product.price).toFixed(2);
        card.querySelectorAll("p")[1].textContent =
            product.description;

        card.querySelector("button").addEventListener("click", () => {
            let updatedWishlist = getWishlist();
            updatedWishlist.splice(index, 1);

            localStorage.setItem(
                getWishlistKey(),
                JSON.stringify(updatedWishlist)
            );

            renderWishlist();
        });

        wishlistContainer.appendChild(card);
    });
}

// OPEN PRODUCT DETAILS
function openProduct(product) {
   const detailImage = document.getElementById("detailEmoji");

detailImage.innerHTML = "";

if (product.image) {
    const img = document.createElement("img");

    img.src = product.image;
    img.alt = product.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "12px";

    detailImage.appendChild(img);
} else {
    detailImage.textContent = product.emoji || "🛍️";
}
    document.getElementById("detailCategory").textContent =
        product.category;

    document.getElementById("detailName").textContent =
        product.name;

    document.getElementById("detailPrice").textContent =
        "RM " + Number(product.price).toFixed(2);

    document.getElementById("detailDescription").textContent =
        product.description;

    document.getElementById("detailSeller").textContent =
        product.seller;

    document.getElementById("productModal").style.display = "flex";

    window.selectedProduct = product;
    renderProductReviews();
}

// CLOSE PRODUCT DETAILS
function closeProduct() {
    document.getElementById("productModal").style.display = "none";
}

// CONTACT SELLER - DEMO

function contactSeller() {
    const product = window.selectedProduct;

    if (!product || !product.phone) {
        alert("Seller WhatsApp number is not available.");
        return;
    }

    let phone = product.phone.replace(/\D/g, "");

    if (phone.startsWith("0")) {
        phone = "60" + phone.substring(1);
    }

    const message =
        `Hi! I'm interested in your ${product.name} listed on UNIFIND. Is it still available?`;

    const whatsappURL =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}




// FILTER BY CATEGORY
function filterCategory(category) {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {
        button.classList.remove("selected");

        if (
            category === "All" &&
            button.textContent === "All Items"
        ) {
            button.classList.add("selected");
        } else if (
            button.textContent === category
        ) {
            button.classList.add("selected");
        }
    });

    const filtered = category === "All"
        ? products
        : products.filter(item => item.category === category);

    displayProducts(filtered);

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

// SEARCH PRODUCTS
function searchProducts() {
    sortProducts();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


function sortProducts() {
    const keyword = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    const category = document.getElementById("categoryFilter").value;
    const sortValue = document.getElementById("sortPrice").value;

    let results = products.filter(item => {
        const matchSearch =
            item.name.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword);

        const matchCategory =
            category === "all" ||
            item.category.toLowerCase() === category.toLowerCase();

        return matchSearch && matchCategory;
    });

    if (sortValue === "low") {
        results.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortValue === "high") {
        results.sort((a, b) => Number(b.price) - Number(a.price));
    }

    displayProducts(results);
}

// SEARCH USING ENTER KEY
document.getElementById("searchInput")
    .addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchProducts();
        }
    });

// GO TO SELL SECTION
function goToSell() {
    document.getElementById("sellFormSection").style.display = "block";

    document.getElementById("sellFormSection")
        .scrollIntoView({ behavior: "smooth" });
}

function openSellForm() {
    goToSell();
}

// ADD NEW PRODUCT
document.getElementById("sellForm")
  .addEventListener('submit', async function(event) {
        event.preventDefault();
        const imageFile = document.getElementById("itemImage").files[0];

const image = imageFile ? await new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function(event) {
        resolve(event.target.result);
    };

    reader.readAsDataURL(imageFile);
}) : "";

const newProduct = {
    name: document.getElementById("itemName").value.trim(),
    category: document.getElementById("itemCategory").value,
    price: Number(document.getElementById("itemPrice").value),
    description: document.getElementById("itemDescription").value.trim(),
    seller: document.getElementById("sellerName").value.trim(),
    ownerEmail: getCurrentUser()?.email || "",
    phone: document.getElementById("sellerPhone").value.trim(),
    emoji: "🛍️",
    image: image 

};

        if (
            !newProduct.name ||
            !newProduct.category ||
            !newProduct.description ||
            !newProduct.seller ||
            !newProduct.phone ||
            !Number.isFinite(newProduct.price) ||
            newProduct.price < 0
        ) {
            return;
        }

        products.unshift(newProduct);

saveProducts();

displayProducts(products);

renderDashboard();

        document.getElementById("sellForm").reset();

        document.getElementById("formMessage").textContent =
            "Your listing has been added successfully!";

        document.getElementById("products")
            .scrollIntoView({ behavior: "smooth" });
    });


// UNIFIND AUTHENTICATION SYSTEM

// GET REGISTERED ACCOUNTS
function getAccounts() {
    return JSON.parse(
        localStorage.getItem("unifindAccounts")
    ) || [];
}

// GET CURRENT USER
function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem("unifindCurrentUser")
    );
}

// OPEN LOGIN MODAL
function openLogin() {
    document.getElementById("loginModal").style.display = "flex";

    if (getCurrentUser()) {
        showAccount();
    } else {
        showLogin();
    }
}

// CLOSE MODAL
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

// SHOW LOGIN
function showLogin() {
    document.getElementById("loginView").style.display = "block";
    document.getElementById("registerView").style.display = "none";
    document.getElementById("accountView").style.display = "none";

    document.getElementById("loginMessage").textContent = "";
}

// SHOW REGISTER
function showRegister() {
    document.getElementById("loginView").style.display = "none";
    document.getElementById("registerView").style.display = "block";
    document.getElementById("accountView").style.display = "none";

    document.getElementById("registerMessage").textContent = "";
}

// SHOW ACCOUNT
function showAccount() {
    const user = getCurrentUser();

    if (!user) return;

    document.getElementById("loginView").style.display = "none";
    document.getElementById("registerView").style.display = "none";
    document.getElementById("accountView").style.display = "block";

    document.getElementById("welcomeName").textContent =
        "Hello, " + user.name + "!";

    document.getElementById("welcomeEmail").textContent =
        user.email;
}

// UPDATE NAVIGATION BUTTON
function updateAuthButton() {
    const button = document.querySelector(".login-btn");
    const user = getCurrentUser();

    if (button) {
        button.textContent = user ? "My Account" : "Login";
    }
}

// REGISTER NEW ACCOUNT
document.getElementById("registerForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.style.color = "#c03939";
            return;
        }

        const accounts = getAccounts();

        const existingAccount = accounts.find(
            account => account.email === email
        );

        if (existingAccount) {
            message.textContent = "This email is already registered!";
            message.style.color = "#c03939";
            return;
        }

const matric = document.getElementById("registerMatric").value.trim();
const college = document.getElementById("registerCollege").value.trim();
const faculty = document.getElementById("registerFaculty").value.trim();

const newAccount = {
    name: name,
    email: email,
    password: password,
    matric: matric,
    college: college,
    faculty: faculty
};

        accounts.push(newAccount);

        localStorage.setItem(
            "unifindAccounts",
            JSON.stringify(accounts)
        );

        localStorage.setItem(
            "unifindCurrentUser",
            JSON.stringify({
                name: name,
                email: email,
        matric: matric,
        college: college,
        faculty: faculty
            })
        );

        updateAuthButton();
        showAccount();
        renderProfile();

});

// LOGIN EXISTING ACCOUNT
document.getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const accounts = getAccounts();

        const user = accounts.find(account =>
            account.email === email &&
            account.password === password
        );

        const message = document.getElementById("loginMessage");

        if (!user) {
            message.textContent = "Incorrect email or password!";
            message.style.color = "#c03939";
            return;
        }

        localStorage.setItem(
            "unifindCurrentUser",
            JSON.stringify({
                name: user.name,
                email: user.email,
                matric: user.matric || "",
        college: user.college || "",
        faculty: user.faculty || ""
            })
        );

        updateAuthButton();
        showAccount();
        renderProfile();

});

// LOGOUT
function logoutUser() {

    const confirmation = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmation) {

        localStorage.removeItem("unifindCurrentUser");

        updateAuthButton();
        showLogin();

        alert("You have successfully logged out!");
    }
}

// CLOSE MODAL WHEN CLICKING OUTSIDE
document.getElementById("loginModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeLogin();
        }

});

// INITIALIZE AUTH BUTTON
updateAuthButton();


// RENDER MY PROFILE
function renderProfile() {

    const user = getCurrentUser();

    if (!user) {
        document.getElementById("profileName").textContent =
            "Please Login";

        document.getElementById("profileEmail").textContent =
            "Login to view your profile";

        return;
    }

    document.getElementById("profileName").textContent =
        user.name;

    document.getElementById("profileEmail").textContent =
        user.email;

    document.getElementById("profileAvatar").textContent =
        user.name.charAt(0).toUpperCase();

    document.getElementById("profileMatric").textContent =
        user.matric || "-";

    document.getElementById("profileCollege").textContent =
        user.college || "-";

    document.getElementById("profileFaculty").textContent =
        user.faculty || "-";

    document.getElementById("profileStudentEmail").textContent =
        user.email;
}


// EDIT PROFILE
function editProfile() {

    const user = getCurrentUser();

    if (!user) {
        alert("Please login to edit your profile.");
        openLogin();
        return;
    }

    const newName = prompt("Enter your name:", user.name);
    if (newName === null) return;

    const newCollege = prompt("Enter your college:", user.college || "");
    if (newCollege === null) return;

    const newFaculty = prompt("Enter your faculty:", user.faculty || "");
    if (newFaculty === null) return;

    if (!newName.trim() || !newCollege.trim() || !newFaculty.trim()) {
        alert("Please complete all profile information.");
        return;
    }

    user.name = newName.trim();
    user.college = newCollege.trim();
    user.faculty = newFaculty.trim();

    localStorage.setItem(
        "unifindCurrentUser",
        JSON.stringify(user)
    );

    const accounts = getAccounts();
    const accountIndex = accounts.findIndex(
        account => account.email === user.email
    );

    if (accountIndex !== -1) {
        accounts[accountIndex].name = user.name;
        accounts[accountIndex].college = user.college;
        accounts[accountIndex].faculty = user.faculty;

        localStorage.setItem(
            "unifindAccounts",
            JSON.stringify(accounts)
        );
    }

    renderProfile();
    updateAuthButton();

    alert("Profile updated successfully!");
}

// PRODUCT IMAGE PREVIEW

document.getElementById("itemImage").addEventListener("change", function() {
    const file = this.files[0];
    const preview = document.getElementById("imagePreview");

    preview.innerHTML = "";

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = document.createElement("img");
            img.src = event.target.result;
            img.style.width = "180px";
            img.style.height = "180px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "10px";

            preview.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});
// CUSTOM EDIT PRODUCT

let editingProductIndex = null;

function editProduct(index) {
    editingProductIndex = index;

    const product = products[index];

    document.getElementById("editNameInput").value = product.name;
    document.getElementById("editPriceInput").value = product.price;
    document.getElementById("editDescriptionInput").value = product.description || "";

    document.getElementById("editImageInput").value = "";
    document.getElementById("editImagePreview").innerHTML = "";

    if (product.image) {
        const img = document.createElement("img");
        img.src = product.image;
        img.style.width = "150px";
        img.style.height = "150px";
        img.style.objectFit = "contain";
        document.getElementById("editImagePreview").appendChild(img);
    }

    document.getElementById("editField").value = "name";
    showEditFields();

    document.getElementById("editProductModal").style.display = "flex";
}

function showEditFields() {
    const choice = document.getElementById("editField").value;

    document.getElementById("editNameField").style.display =
        choice === "name" || choice === "all" ? "block" : "none";

    document.getElementById("editPriceField").style.display =
        choice === "price" || choice === "all" ? "block" : "none";

    document.getElementById("editDescriptionField").style.display =
        choice === "description" || choice === "all" ? "block" : "none";

    document.getElementById("editImageField").style.display =
        choice === "image" || choice === "all" ? "block" : "none";
}

function closeEditProduct() {
    document.getElementById("editProductModal").style.display = "none";
}

document.getElementById("editImageInput").addEventListener("change", function() {
    const file = this.files[0];
    const preview = document.getElementById("editImagePreview");

    preview.innerHTML = "";

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = document.createElement("img");
            img.src = event.target.result;
            img.style.width = "150px";
            img.style.height = "150px";
            img.style.objectFit = "contain";

            preview.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});

async function saveEditedProduct() {
    const index = editingProductIndex;
    if (index === null) return;

    const product = products[index];
    const choice = document.getElementById("editField").value;

    if (choice === "name" || choice === "all") {
        const name = document.getElementById("editNameInput").value.trim();
        if (!name) {
            alert("Product name cannot be empty.");
            return;
        }
        product.name = name;
    }

    if (choice === "price" || choice === "all") {
        const price = Number(document.getElementById("editPriceInput").value);
        if (!Number.isFinite(price) || price <= 0) {
            alert("Please enter a valid price.");
            return;
        }
        product.price = price;
    }

    if (choice === "description" || choice === "all") {
        product.description = document.getElementById("editDescriptionInput").value.trim();
    }

    if (choice === "image" || choice === "all") {
        const file = document.getElementById("editImageInput").files[0];

        if (file) {
            const image = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = event => resolve(event.target.result);
                reader.readAsDataURL(file);
            });

            product.image = image;
        }
    }

    saveProducts();
    displayProducts(products);
    renderDashboard();

    closeEditProduct();
    alert("Product updated successfully!");
}

// INITIALIZE WEBSITE
displayProducts(products);
renderDashboard();
renderProfile();
updateAuthButton();

// RENDER SELLER DASHBOARD
function renderDashboard() {
    const dashboard = document.getElementById("dashboardProducts");
    const user = getCurrentUser();

    dashboard.innerHTML = "";

    if (!user) {
        document.getElementById("totalListings").textContent = 0;
        document.getElementById("activeListings").textContent = 0;
        dashboard.textContent = "Please login to view your listings.";
        return;
    }

    const myProducts = products
        .map((product, index) => ({
            ...product,
            originalIndex: index
        }))
        .filter(product =>
            product.ownerEmail &&
            product.ownerEmail.toLowerCase() === user.email.toLowerCase()
        );

    document.getElementById("totalListings").textContent =
        myProducts.length;

    document.getElementById("activeListings").textContent =
        new Set(myProducts.map(item => item.category)).size;

    if (myProducts.length === 0) {
        dashboard.textContent = "You have no product listings yet.";
        return;
    }

    myProducts.forEach((product) => {
        const index = product.originalIndex;

        const card = document.createElement("div");
        card.className = "dashboard-card";
const emoji = document.createElement("div");

emoji.style.width = "100%";
emoji.style.height = "150px";
emoji.style.display = "flex";
emoji.style.alignItems = "center";
emoji.style.justifyContent = "center";
emoji.style.overflow = "hidden";
emoji.style.borderRadius = "10px";
emoji.style.background = "#f5f7fb";

if (product.image) {
    const img = document.createElement("img");

    img.src = product.image;
    img.alt = product.name;

    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.display = "block";

    emoji.appendChild(img);

} else {
    emoji.textContent = product.emoji || "🛍️";
    emoji.style.fontSize = "35px";
}

        const category = document.createElement("p");
        category.textContent = product.category;

        const name = document.createElement("h4");
        name.textContent = product.name;

        const price = document.createElement("div");
        price.className = "dashboard-price";
        price.textContent = "RM " + Number(product.price).toFixed(2);

        const description = document.createElement("p");
        description.textContent = product.description;

        const actions = document.createElement("div");
        actions.className = "dashboard-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "✏️ Edit";

        editButton.addEventListener("click", () => {
            editProduct(index);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "🗑️ Delete";

        deleteButton.addEventListener("click", () => {
            deleteProduct(index);
        });

        actions.append(editButton, deleteButton);

        card.append(
            emoji,
            category,
            name,
            price,
            description,
            actions
        );

        dashboard.appendChild(card);
    });
}





// CUSTOM EDIT PRODUCT

function editProduct(index) {
    editingProductIndex = index;

    const product = products[index];

    document.getElementById("editNameInput").value = product.name;
    document.getElementById("editPriceInput").value = product.price;
    document.getElementById("editDescriptionInput").value =
        product.description || "";

    document.getElementById("editImageInput").value = "";
    document.getElementById("editImagePreview").innerHTML = "";

    if (product.image) {
        const img = document.createElement("img");
        img.src = product.image;
        img.style.width = "150px";
        img.style.height = "150px";
        img.style.objectFit = "contain";

        document.getElementById("editImagePreview").appendChild(img);
    }

    document.getElementById("editField").value = "name";
    showEditFields();

    document.getElementById("editProductModal").style.display = "flex";
}


// SHOW SELECTED EDIT FIELD

function showEditFields() {
    const choice = document.getElementById("editField").value;

    document.getElementById("editNameField").style.display =
        choice === "name" || choice === "all" ? "block" : "none";

    document.getElementById("editPriceField").style.display =
        choice === "price" || choice === "all" ? "block" : "none";

    document.getElementById("editDescriptionField").style.display =
        choice === "description" || choice === "all" ? "block" : "none";

    document.getElementById("editImageField").style.display =
        choice === "image" || choice === "all" ? "block" : "none";
}


// IMAGE PREVIEW

document.getElementById("editImageInput").addEventListener("change", function() {
    const file = this.files[0];
    const preview = document.getElementById("editImagePreview");

    preview.innerHTML = "";

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = document.createElement("img");
            img.src = event.target.result;
            img.style.width = "150px";
            img.style.height = "150px";
            img.style.objectFit = "contain";

            preview.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});


// SAVE EDITED PRODUCT

async function saveEditedProduct() {
    const index = editingProductIndex;

    if (index === null) return;

    const product = products[index];
    const choice = document.getElementById("editField").value;

    if (choice === "name" || choice === "all") {
        const name = document.getElementById("editNameInput").value.trim();

        if (!name) {
            alert("Product name cannot be empty.");
            return;
        }

        product.name = name;
    }

    if (choice === "price" || choice === "all") {
        const priceInput = document.getElementById("editPriceInput").value;
        const price = Number(priceInput);

        if (priceInput.trim() === "" || !Number.isFinite(price) || price <= 0) {
            alert("Please enter a valid price.");
            return;
        }

        product.price = price;
    }

    if (choice === "description" || choice === "all") {
        const description = document.getElementById("editDescriptionInput").value.trim();

        if (!description) {
            alert("Description cannot be empty.");
            return;
        }

        product.description = description;
    }

    if (choice === "image" || choice === "all") {
        const file = document.getElementById("editImageInput").files[0];

        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image.");
                return;
            }

            const image = await new Promise(resolve => {
                const reader = new FileReader();

                reader.onload = event => resolve(event.target.result);
                reader.readAsDataURL(file);
            });

            product.image = image;
        }
    }

    saveProducts();
    displayProducts(products);
    renderDashboard();

    closeEditProduct();

    editingProductIndex = null;

    alert("Product updated successfully!");
}


// CLOSE EDIT PRODUCT

function closeEditProduct() {
    document.getElementById("editProductModal").style.display = "none";
    editingProductIndex = null;
}




// DELETE PRODUCT
function deleteProduct(index) {

    const confirmation = confirm(
        "Are you sure you want to delete this product?"
    );

    if (confirmation) {

        products.splice(index, 1);

        saveProducts();
        displayProducts(products);
        renderDashboard();

        alert("Product deleted successfully!");
    }
}

// MY PURCHASES FUNCTIONS

function getPurchasesKey() {
    const user = getCurrentUser();

    if (!user) return null;

    return "unifindPurchases_" + user.email.toLowerCase();
}

function getPurchases() {
    const key = getPurchasesKey();

    if (!key) return [];

    return JSON.parse(localStorage.getItem(key)) || [];
}

function addToPurchases() {
    const user = getCurrentUser();

    if (!user) {
        alert("Please login first.");
        return;
    }

    if (!window.selectedProduct) {
        alert("Please select a product first.");
        return;
    }

    const purchases = getPurchases();

    purchases.push({
        ...window.selectedProduct,
        purchaseDate: new Date().toLocaleDateString()
    });

    localStorage.setItem(
        getPurchasesKey(),
        JSON.stringify(purchases)
    );

    alert("Product added to My Purchases!");

    renderPurchases();
}

function renderPurchases() {
    const container = document.getElementById("purchaseProducts");

    if (!container) return;

    const purchases = getPurchases();

    container.innerHTML = "";

    if (purchases.length === 0) {
        container.textContent = "You have no purchase records yet.";
        return;
    }

    purchases.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "dashboard-card";

        const name = document.createElement("h4");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "RM " + Number(product.price).toFixed(2);

        const seller = document.createElement("p");
        seller.textContent = "Seller: " + product.seller;

        const date = document.createElement("p");
        date.textContent = "Date: " + product.purchaseDate;

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "Remove Record";

        remove.addEventListener("click", () => {
            const updated = getPurchases();
            updated.splice(index, 1);

            localStorage.setItem(
                getPurchasesKey(),
                JSON.stringify(updated)
            );

            renderPurchases();
        });

        card.append(name, price, seller, date, remove);
        container.appendChild(card);
    });
}

// SELLER REVIEW SYSTEM

function getReviewKey(product) {
    return "unifindReviews_" +
        product.name + "_" +
        product.seller;
}

function submitReview() {
    const user = getCurrentUser();

    if (!user) {
        alert("Please login before submitting a review.");
        return;
    }

    const product = window.selectedProduct;

    if (!product) {
        alert("Please select a product first.");
        return;
    }

    const rating = Number(
        document.getElementById("reviewRating").value
    );

    const comment = document.getElementById("reviewComment")
        .value.trim();

    if (!comment) {
        alert("Please write your comment first.");
        return;
    }

    let reviews = JSON.parse(
        localStorage.getItem(getReviewKey(product))
    ) || [];

    const alreadyReviewed = reviews.some(
        review => review.email === user.email
    );

    if (alreadyReviewed) {
        alert("You have already reviewed this product.");
        return;
    }

    reviews.push({
        name: user.name,
        email: user.email,
        rating: rating,
        comment: comment,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem(
        getReviewKey(product),
        JSON.stringify(reviews)
    );

    document.getElementById("reviewComment").value = "";

    alert("Thank you! Your review has been submitted.");

    renderProductReviews();
}


function renderProductReviews() {
    const product = window.selectedProduct;
    const container = document.getElementById("productReviews");

    if (!product || !container) return;

    const reviews = JSON.parse(
        localStorage.getItem(getReviewKey(product))
    ) || [];

    container.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Customer Reviews ⭐";
    container.appendChild(heading);

    if (reviews.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No reviews yet.";
        container.appendChild(empty);
       document.getElementById("sellerAverage").textContent =
    "No ratings yet";
    return;
    }

    const average = reviews.reduce(
        (total, review) => total + review.rating, 0
    ) / reviews.length;
    document.getElementById("sellerAverage").textContent =
    "⭐ " + average.toFixed(1) + " / 5 (" +
    reviews.length + " reviews)";

    const summary = document.createElement("p");
    summary.textContent =
        "Average Rating: " + average.toFixed(1) +
        " / 5 (" + reviews.length + " reviews)";

    container.appendChild(summary);

    reviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "review-card";

        const reviewer = document.createElement("strong");
        reviewer.textContent = review.name;

        const stars = document.createElement("p");
        stars.textContent = "⭐".repeat(review.rating);

        const comment = document.createElement("p");
        comment.textContent = review.comment;

        const date = document.createElement("small");
        date.textContent = review.date;

        card.append(reviewer, stars, comment, date);
        container.appendChild(card);
    });
}

// CLOSE PRODUCT MODAL WHEN CLICKING OUTSIDE

document.getElementById("productModal")
    .addEventListener("click", function(event) {
        if (event.target === this) {
            closeProduct();
        }
    });


// SELLER PROFILE FUNCTIONS

let selectedProfileSeller = null;

function openSellerProfile() {
    const product = window.selectedProduct;

    if (!product) return;

    selectedProfileSeller = product.seller;

    document.getElementById("sellerProfileName").textContent =
        selectedProfileSeller;

    const sellerProducts = products.filter(item =>
        item.seller === selectedProfileSeller
    );

    const allReviews = [];

    sellerProducts.forEach(item => {
        const key = getReviewKey(item);
        const reviews = JSON.parse(localStorage.getItem(key)) || [];
        allReviews.push(...reviews);
    });

    const ratingElement =
        document.getElementById("sellerProfileRating");

    if (allReviews.length > 0) {
        const average = allReviews.reduce(
            (total, review) => total + Number(review.rating), 0
        ) / allReviews.length;

        ratingElement.textContent =
            "⭐ " + average.toFixed(1) + " / 5 (" +
            allReviews.length + " reviews)";
    } else {
        ratingElement.textContent = "No ratings yet";
    }

    const container =
        document.getElementById("sellerProfileProducts");

    container.innerHTML = "";

    sellerProducts.forEach(item => {
      const card = document.createElement("div");
card.className = "dashboard-card";

const imageBox = document.createElement("div");

imageBox.style.width = "100%";
imageBox.style.height = "150px";
imageBox.style.display = "flex";
imageBox.style.alignItems = "center";
imageBox.style.justifyContent = "center";
imageBox.style.overflow = "hidden";
imageBox.style.borderRadius = "10px";
imageBox.style.background = "#f5f7fb";
imageBox.style.marginBottom = "12px";

if (item.image) {
    const img = document.createElement("img");

    img.src = item.image;
    img.alt = item.name;
    img.style.width = "100%";
    img.style.height = "100%";
   img.style.objectFit = "contain";
img.style.background = "#f5f7fb";

    imageBox.appendChild(img);
} else {
    imageBox.textContent = item.emoji || "🛍️";
    imageBox.style.fontSize = "35px";
}

const name = document.createElement("h4");
name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = "RM " + Number(item.price).toFixed(2);

        card.append(imageBox, name, price);
        container.appendChild(card);
    });

    document.getElementById("sellerProfileModal").style.display =
        "flex";
}


function closeSellerProfile() {
    document.getElementById("sellerProfileModal").style.display =
        "none";
}


function contactProfileSeller() {
    const sellerProduct = products.find(item =>
        item.seller === selectedProfileSeller && item.phone
    );

    if (!sellerProduct) {
        alert("Seller WhatsApp number is not available.");
        return;
    }

    window.selectedProduct = sellerProduct;
    contactSeller();
}
