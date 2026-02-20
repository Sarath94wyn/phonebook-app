const API_URL = "https://jsonplaceholder.typicode.com/users";

const contactList = document.getElementById("contactList");
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const searchInput = document.getElementById("search");
const errorText = document.getElementById("error");
const contactIdInput = document.getElementById("contactId");

let contacts = [];

async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();

        contacts = data.map(user => ({
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email
         
        }));

        displayContacts(contacts);

    } catch (error) {
        errorText.textContent = error.message;
    }
}

function displayContacts(contactArray) {
    contactList.innerHTML = "";

    contactArray.forEach(contact => {
        const li = document.createElement("li");

        li.innerHTML = `
  <span class="contact-text">${contact.name} - ${contact.phone}</span>
  <div class="action-buttons">
      <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
      <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
  </div>
`;

        contactList.appendChild(li);
    });
}

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
        errorText.textContent = "All fields are required";
        return;
    }

    errorText.textContent = "";

    if (contactIdInput.value) {
        const id = Number(contactIdInput.value);
        const index = contacts.findIndex(c => c.id === id);

        if (index !== -1) {
            contacts[index].name = name;
            contacts[index].phone = phone;
        }

        contactIdInput.value = "";
    }

    else {
        const newContact = {
            id: Date.now(), 
            name,
            phone
        };

        contacts.push(newContact);
    }

    displayContacts(contacts);
    contactForm.reset();
});

function editContact(id) {
    const contact = contacts.find(c => c.id === id);

    if (contact) {
        contactIdInput.value = contact.id;
        nameInput.value = contact.name;
        phoneInput.value = contact.phone;
    }
}

function deleteContact(id) {
    contacts = contacts.filter(contact => contact.id !== id);
    displayContacts(contacts);
}

searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchValue) ||
        contact.phone.includes(searchValue)
    );

    displayContacts(filteredContacts);
});

fetchContacts();