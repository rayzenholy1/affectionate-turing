import React, { useState, useEffect } from "react";
import "./styles.css";
const ContactForm = ({ addOrUpdateContact, currentContact, cancelEdit }) => {
  const initialFormState = {
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (currentContact) {
      setFormData(currentContact);
    } else {
      setFormData(initialFormState);
    }
  }, [currentContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.lastName || !formData.phone)
      return alert("Прізвище та телефон обов'язкові!");

    addOrUpdateContact(formData);
    setFormData(initialFormState);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>{currentContact ? "Редагування контакту" : "Новий контакт"}</h3>

      <input
        type="text"
        name="firstName"
        placeholder="Ім'я"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Прізвище (для пошуку)"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <div className="form-actions">
        <button type="submit" className="btn-save">
          {currentContact ? "Зберегти зміни" : "Додати"}
        </button>

        {currentContact && (
          <button type="button" onClick={cancelEdit} className="btn-cancel">
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
};

export default function App() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      firstName: "Олег",
      lastName: "Петренко",
      email: "oleg@mail.com",
      phone: "+380501112233",
    },
    {
      id: 2,
      firstName: "Марія",
      lastName: "Коваленко",
      email: "maria@mail.com",
      phone: "+380974445566",
    },
  ]);

  const [editingContact, setEditingContact] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const addOrUpdateContact = (contact) => {
    if (contact.id) {
      setContacts(contacts.map((c) => (c.id === contact.id ? contact : c)));
      setEditingContact(null);
    } else {
      const newContact = { ...contact, id: Date.now() };
      setContacts([...contacts, newContact]);
    }
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Видалити цей контакт?")) {
      setContacts(contacts.filter((c) => c.id !== id));
      if (editingContact && editingContact.id === id) {
        setEditingContact(null);
      }
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Телефонна книга</h1>

      <div className="container">
        <div className="left-panel">
          <ContactForm
            addOrUpdateContact={addOrUpdateContact}
            currentContact={editingContact}
            cancelEdit={() => setEditingContact(null)}
          />
        </div>

        <div className="right-panel">
          <div className="search-box">
            <input
              type="text"
              placeholder="Пошук за прізвищем..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="contact-list">
            {filteredContacts.length === 0 ? (
              <p>Контактів не знайдено.</p>
            ) : (
              filteredContacts.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-info">
                    <strong>
                      {contact.firstName} {contact.lastName}
                    </strong>
                    <br />
                    <span>📞 {contact.phone}</span>
                    <br />
                    <small>✉️ {contact.email}</small>
                  </div>
                  <div className="contact-actions">
                    <button
                      onClick={() => handleEditClick(contact)}
                      className="btn-edit"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteClick(contact.id)}
                      className="btn-delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
