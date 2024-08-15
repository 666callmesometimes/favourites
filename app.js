const LOCAL_STORAGE_KEY = "wishlistApp";

// Retrieve data from Local Storage or initialize empty object
let wishlists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};

document.getElementById('addWishlistBtn').addEventListener('click', function() {
    openWishlistModal();
});

document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function() {
        closeModal(btn.closest('.modal'));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Sprawdzenie stanu dark mode podczas ładowania strony
    const darkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }

    document.querySelector('.dropdown-toggle').addEventListener('click', function() {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex'; 
    });
});

// Obsługa przełączania dark mode w czasie rzeczywistym
document.getElementById('darkModeToggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.checked);
});

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keyup', function(e) {
    const searchString = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        const name = item.querySelector('.item-name').textContent.toLowerCase();
        if (name.includes(searchString)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

const dropdownToggle = document.querySelector('.dropdown-toggle');
dropdownToggle.addEventListener('click', function() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const isOpen = dropdownMenu.style.display === 'flex';

    if (isOpen) {
        dropdownMenu.style.display = 'flex';
        dropdownToggle.classList.remove('settings-open');
        dropdownToggle.classList.add('settings-closed');
    } else {
        dropdownMenu.style.display = 'none';
        dropdownToggle.classList.remove('settings-closed');
        dropdownToggle.classList.add('settings-open');
    }
});

function openWishlistModal() {
    document.getElementById('addWishlistModal').style.display = 'flex';
}

function openItemModal(wishlistId, itemId = null) {
    const itemForm = document.getElementById('itemForm');
    itemForm.setAttribute('data-wishlist-id', wishlistId);
    itemForm.setAttribute('data-item-id', itemId || '');
    
    if (itemId) {
        const item = wishlists[wishlistId].items.find(i => i.id === itemId);
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemLink').value = item.link;
        document.getElementById('itemImage').value = item.image;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemSize').value = item.size;
        document.getElementById('itemBatch').value = item.batch;
    } else {
        itemForm.reset();
    }

    document.getElementById('wishlistModal').style.display = 'flex';
}

function openEditWishlistModal(wishlistId) {
    const editWishlistForm = document.getElementById('editWishlistForm');
    editWishlistForm.setAttribute('data-wishlist-id', wishlistId);
    document.getElementById('editWishlistName').value = wishlists[wishlistId].name;
    document.getElementById('editWishlistModal').style.display = 'flex';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Handle wishlist form submission
document.getElementById('wishlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const wishlistName = document.getElementById('wishlistName').value;
    addWishlist(wishlistName);
    closeModal(document.getElementById('addWishlistModal'));
});

function addWishlist(wishlistName) {
    const wishlistId = Date.now().toString();
    wishlists[wishlistId] = {
        name: wishlistName,
        items: []
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlists));
    renderWishlist(wishlistId, wishlistName);
}

function editWishlistName(wishlistId, newName) {
    wishlists[wishlistId].name = newName;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlists));
    document.querySelector(`#wishlist-${wishlistId} .wishlist-name`).textContent = newName;
}

// Handle edit wishlist form submission
document.getElementById('editWishlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const wishlistId = e.target.getAttribute('data-wishlist-id');
    const newName = document.getElementById('editWishlistName').value;
    editWishlistName(wishlistId, newName);
    closeModal(document.getElementById('editWishlistModal'));
});

function deleteWishlist(wishlistId) {
    delete wishlists[wishlistId];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlists));
    document.getElementById(`wishlist-${wishlistId}`).remove();
}

// Render all wishlists on page load
function renderAllWishlists() {
    Object.keys(wishlists).forEach(wishlistId => {
        const wishlist = wishlists[wishlistId];
        renderWishlist(wishlistId, wishlist.name);
    });

    
}

//darkmodeeeeeeeeeeeee


function renderWishlist(wishlistId, wishlistName) {
    const wishlistContainer = document.getElementById('wishlistContainer');

    const wishlistHTML = `
        <div class="wishlist" id="wishlist-${wishlistId}">
            <div class="wishlist-header">
                <h2 class="wishlist-name">${wishlistName}</h2>
                <span class="wishlistButtons">
                <button class="editWishlistBtn" onclick="openEditWishlistModal('${wishlistId}')">Edit Name</button>
                <button class="deleteWishlistBtn" onclick="deleteWishlist('${wishlistId}')">Delete Wishlist</button>
                <button onclick="openItemModal('${wishlistId}')">Add Item</button>
                </span>
            </div>
            <div class="wishlist-items" id="wishlist-items-${wishlistId}">
                <!-- Items will be dynamically added here -->
            </div>
        </div>
    `;

    wishlistContainer.insertAdjacentHTML('beforeend', wishlistHTML);
    renderItems(wishlistId);
}

// Handle item form submission
document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const wishlistId = e.target.getAttribute('data-wishlist-id');
    const itemId = e.target.getAttribute('data-item-id');
    if (itemId) {
        updateItem(wishlistId, itemId);
    } else {
        addItemToWishlist(wishlistId);
    }
    closeModal(document.getElementById('wishlistModal'));
});

function addItemToWishlist(wishlistId) {
    const itemName = document.getElementById('itemName').value;
    const itemLink = document.getElementById('itemLink').value;
    const itemImage = document.getElementById('itemImage').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemSize = document.getElementById('itemSize').value || ' ';
    const itemBatch = document.getElementById('itemBatch').value || ' ';

    const newItem = {
        id: Date.now().toString(),
        name: itemName,
        link: itemLink,
        image: itemImage,
        price: itemPrice,
        size: itemSize,
        batch: itemBatch
    };

    wishlists[wishlistId].items.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlists));

    renderItem(wishlistId, newItem);
}

function updateItem(wishlistId, itemId) {
    const itemIndex = wishlists[wishlistId].items.findIndex(item => item.id === itemId);

    wishlists[wishlistId].items[itemIndex] = {
        id: itemId,
        name: document.getElementById('itemName').value,
        link: document.getElementById('itemLink').value,
        image: document.getElementById('itemImage').value,
        price: document.getElementById('itemPrice').value,
        size: document.getElementById('itemSize').value || ' ',
        batch: document.getElementById('itemBatch').value || ' '
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlists));

    const itemElement = document.getElementById(`item-${itemId}`);

    // Aktualizacja linku
    itemElement.querySelector('a').href = wishlists[wishlistId].items[itemIndex].link;
    
    // Aktualizacja obrazu
    itemElement.querySelector('.item-img').src = wishlists[wishlistId].items[itemIndex].image;
    itemElement.querySelector('.item-img').alt = wishlists[wishlistId].items[itemIndex].name;
    
    // Aktualizacja nazwy przedmiotu
    itemElement.querySelector('.item-name').textContent = wishlists[wishlistId].items[itemIndex].name;
    
    // Aktualizacja ceny
    itemElement.querySelector('p:nth-of-type(1) b').textContent = wishlists[wishlistId].items[itemIndex].price;
    
    // Aktualizacja rozmiaru
    itemElement.querySelector('p:nth-of-type(2) b').textContent = wishlists[wishlistId].items[itemIndex].size;
    
    // Aktualizacja batcha
    itemElement.querySelector('p:nth-of-type(3) b').textContent = wishlists[wishlistId].items[itemIndex].batch;
    }

function renderItems(wishlistId) {
    const wishlistItemsContainer = document.getElementById(`wishlist-items-${wishlistId}`);
    wishlistItemsContainer.innerHTML = '';

    wishlists[wishlistId].items.forEach(item => {
        renderItem(wishlistId, item);
    });
}



//shareowanie itemu
function encodeItemToURL(item) {
    const itemString = JSON.stringify(item);
    return btoa(itemString);
}

function decodeItemFromURL(encodedString) {
    try {
        const itemString = atob(encodedString);
        return JSON.parse(itemString);
    } catch (e) {
        console.error("Invalid item data in URL", e);
        return null;
    }
}

function generateShareableURL(item) {
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedItem = encodeItemToURL(item);
    return `${baseUrl}?sharedItem=${encodedItem}`;
}

function handleSharedItem() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedItemParam = urlParams.get('sharedItem');

    if (sharedItemParam) {
        const item = decodeItemFromURL(sharedItemParam);

        if (item) {
            if (!wishlists.shared) {
                wishlists.shared = {
                    name: "Shared Items",
                    items: []
                };
                renderWishlist("shared", wishlists.shared.name);
            }

            // Dodajemy item do listy "Shared"
            wishlists.shared.items.push({ ...item, id: Date.now().toString() });
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlists));

            // Renderowanie nowo dodanego itemu
            renderItem("shared", item);
        }
    }
}


function renderSharedWishlist() {
    if (wishlists.shared) {
        renderWishlist("shared", wishlists.shared.name);
    }
}

function renderItem(wishlistId, item) {
    const wishlistItemsContainer = document.getElementById(`wishlist-items-${wishlistId}`);

    const itemHTML = `
        <div class="item" id="item-${item.id}">
            <a href="${item.link}" target="_blank">
                <img class="item-img" src="${item.image}" alt="${item.name}" referrerpolicy="no-referrer" >
                <span class="item-details">
                   <h3 class="item-name">${item.name}</h3>
                    <p>Price: <b>${item.price}¥</b></p>
                    <p>Size: <b>${item.size}</b></p>
                    <p>Batch: <b>${item.batch}</b></p>
                </span>
            </a>
            <div class="item-actions">
                <button class="editItemBtn" onclick="openItemModal('${wishlistId}', '${item.id}')">Edit</button>
                <button class="deleteItemBtn" onclick="deleteItem('${wishlistId}', '${item.id}')">Delete</button>
                <button class="shareItemBtn" onclick="shareItem('${wishlistId}', '${item.id}')">Share</button>
            </div>
        </div>
    `;

    wishlistItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
}

function shareItem(wishlistId, itemId) {
    const item = wishlists[wishlistId].items.find(i => i.id === itemId);
    const shareableURL = generateShareableURL(item);
    prompt("Share this URL with others:", shareableURL);
}

function deleteItem(wishlistId, itemId) {
    wishlists[wishlistId].items = wishlists[wishlistId].items.filter(item => item.id !== itemId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlists));
    document.getElementById(`item-${itemId}`).remove();
}

// Render wishlists on page load
renderAllWishlists();

// Handle shared item from URL
handleSharedItem();

// Close modals when clicking outside of them
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
}
