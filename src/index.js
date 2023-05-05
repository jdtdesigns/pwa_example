import './css/style.css';

import { openDB } from 'idb';
import { setupInstallation } from './install';

const namesOutput = document.querySelector('.names');

// Retrieves the object store from the names_db database
async function getStore(type) {
  const nameDb = await openDB('names_db', 1);

  // Get the transation type readonly/readwrite
  const tx = nameDb.transaction('names', type);

  const store = tx.objectStore('names');

  return store;
}


// Deletes a name from the store
async function deleteName(button) {
  // Get the parent .name-wrap div of the button
  const wrap = button.parentNode;
  const id = parseInt(wrap.dataset.id);

  const store = await getStore('readwrite');

  await store.delete(id);

  wrap.remove();
}


// Updates a name in the store
async function updateName(e) {
  // Only trigger an update if the enter key is pressed
  if (e.keyCode === 13) {
    const input = e.target;
    // Get the parent .name-wrap div of the input
    const wrap = input.parentNode;
    // The dataset value is a string so we have to convert it to a number
    const id = parseInt(wrap.dataset.id);
    const new_value = input.value;
    const store = await getStore('readwrite');

    const name = await store.get(id); // Gets the object from the store with id and name

    await store.put({
      // Spread the id property and name
      ...name,
      // Overwrite the name prop with the new value
      name: new_value
    });

    // Remove the focus from the input after the update takes place
    input.blur();
  }
}


// Gets all names from the store
async function getNames() {
  const store = await getStore('readonly');

  const names = await store.getAll();

  namesOutput.innerHTML = '';

  names.forEach(person => {
    namesOutput.insertAdjacentHTML('beforeend', `
    <div data-id="${person.id}" class="name-wrap">
      <input value="${person.name}">
      <button>Delete</button>
    </div>
    `);
  })
}


// Adds a name to the store
async function addName(eventObj) {
  eventObj.preventDefault();
  const nameInput = document.querySelector('#name-input');

  const store = await getStore('readwrite');

  try {
    // Add the name to the IDB store
    await store.add({
      name: nameInput.value
    });

    getNames();
    // Clear the name input to get ready for a new name
    nameInput.value = '';
  } catch (err) {
    console.log(err);
  }
}


// Initializes the app
async function allSystemsGo() {
  // Create the database and store if they have not been created yet
  await openDB('names_db', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('names')) {
        return console.log('Names db already exists.');
      }

      db.createObjectStore('names', {
        keyPath: 'id',
        autoIncrement: true
      });

      // Will console if the store is removed/doesn't exist
      console.log('Names db created');
    }
  });

  const nameForm = document.querySelector('#name-form');

  // Add event to add a name
  nameForm.addEventListener('submit', addName);

  // Update event listener for the name inputs
  // Uses event delegation, so we don't have to create a listener on all new inputs
  namesOutput.addEventListener('keyup', e => {
    // We pass the event to the updateName function so we can retreive the keyCode and input element
    if (e.target.tagName === 'INPUT') updateName(e);
  });

  // Delete event listener for the delete buttons
  // Uses event delegation, so we don't have to create a listener on all new buttons
  namesOutput.addEventListener('click', e => {
    // We pass the button element to the deleteName function
    if (e.target.tagName === 'BUTTON') deleteName(e.target);
  });

  // Get all names on page load
  getNames();

  // Setup the PWA install btn
  setupInstallation();

  // Load the service worker if in production
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
}

allSystemsGo();




