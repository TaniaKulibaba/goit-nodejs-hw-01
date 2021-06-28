const fs = require('fs/promises');
const path = require('path');
const { v4 } = require('uuid');


const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  }
  catch (error) {
    error.message = "Cannot read contacts file";
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const allContacts = await listContacts();
    const findContact = allContacts.find(item => item.id === contactId);
    if (!findContact) {
      throw new Error(`Id incorrect`);
    }
    return findContact;
  }
  catch (error) {
    throw error;
  }
}

async function updateContacts(newContacts) {
  const str = JSON.stringify(newContacts);
  try {
    await fs.writeFile(contactsPath, str);
  }
  catch (error) {
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const allContacts = await listContacts();
    const index = allContacts.findIndex(item => item.id === contactId);
    if (!index) {
      throw new Error(`Id incorrect`);
    }
    const filteredContacts = allContacts.filter(item => item.id !== contactId);
    await updateContacts(filteredContacts);
    console.log(`The contact with id${contactId} was deleted!`);
  }
  catch (error) {
    throw error;
  }
}

async function addContact(name, email, phone) {
  const newContact = { name, email, phone, id: v4() };
  try {
    const allContacts = await listContacts();
    const newContacts = [...allContacts, newContact];
    await updateContacts(newContacts);
    console.log(`The contact was added!`);
    return newContacts;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact    
};