const fs = require("fs");

const path = "./data/contacts.json";

// ambil data contact dari json
function loadContact() {
  const file = fs.readFileSync(path, "utf8");
  const data = JSON.parse(file);
  return data;
}

// contact detail

function detailContact(nama) {
  const data = loadContact();

  const valid = data.find(
    (item) => item.nama.toLowerCase() === nama.toLowerCase()
  );

  return valid;
}
// save data

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data), "utf-8");
}
// add contact

function addContact(data) {
  const contacts = loadContact();
  contacts.push(data);

  saveData(contacts);
}

// validator data berdasarkan nama
// jika ada nama yang sama maka tidak jadi tambah data

function validasiNama(nama) {
  const contacs = loadContact();

  const valid = contacs.find(
    (item) => item.nama.toLowerCase() === nama.toLowerCase()
  );

  return valid ? false : true;
}

// hapus data berdasarkan nama

function deleteContact(nama) {
  const contacts = loadContact();

  //filter array

  const valid = contacts.filter(
    (e) => e.nama.toLowerCase() !== nama.toLowerCase()
  );
  saveData(valid);
}

// edit contact

function editContact(data) {
  const contacts = loadContact();
  const newData = contacts.filter(
    (e) => e.nama.toLowerCase() !== data.oldNama.toLowerCase()
  );
  delete data.oldNama;
  console.log(data);
  newData.push(data);
  saveData(newData);
}
module.exports = {
  loadContact,
  detailContact,
  addContact,
  validasiNama,
  deleteContact,
  editContact,
};
