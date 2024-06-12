const express = require("express");
const app = express();
const port = 3000;
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookie = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");

const {
  loadContact,
  detailContact,
  addContact,
  validasiNama,
  deleteContact,
  editContact,
} = require("./contacts");

// use view engine ejs
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname + "/views"));
app.set("views", "views");

// konfigurasi flash
app.use(cookie("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // relative terhadap folder views
  res.render("index", {
    title: "Halaman Utama",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    nama: "Admin",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    title: "Halaman Contact",
    nama: "Night Mare",
    contacts,
    msg: req.flash("msg"),
  });
});

// handle add contact

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const validasiNam = validasiNama(value);
      //  jika gagal
      if (!validasiNam) {
        throw new Error("nama sudah di pakai");
      }

      return true;
    }),
    check("nohp", "nohp tidak valid").isMobilePhone("id-ID"),
    check("email", "email tidak valid").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "halaman tambah contact",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      //  kirim pesan
      req.flash("msg", "data berhasil di tambahkan");
      res.redirect("/contact");
    }
  }
);

// form ubah data
app.get("/contact/edit/:nama", (req, res) => {
  const { name } = req.params;
  if (!nama) return res.sendStatus(400);
  const contact = detailContact(nama);
  if (!contact) return res.send(`contact ${nama} tidak di temukan.`);

  res.render("edit-contact", {
    title: "Halaman Ubah Data",
    contact,
  });
});

// handle edit data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const validasiNam = validasiNama(value);
      //  jika gagal
      const oldNama = req.body.oldNama;
      if (value !== oldNama && !validasiNam) {
        throw new Error("nama sudah di pakai");
      }
      return true;
    }),
    check("nohp", "nohp tidak valid").isMobilePhone("id-ID"),
    check("email", "email tidak valid").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(404).json({ errors: errors.array() });
    } else {
      editContact(req.body);
      //  kirim pesan
      req.flash("msg", "data berhasil di ubah");
      res.redirect("/contact");
    }
  }
);

// handle delete contact
app.get("/contact/delete/:nama", (req, res) => {
  if (!req.params.nama) return res.sendStatus(400);
  deleteContact(req.params.nama);
  req.flash("msg", "data berhasil di hapus");
  res.redirect("/contact");
});

// handle contact detail
app.get("/contact/:nama", (req, res) => {
  const { nama } = req.params;
  if (!nama) return res.sendStatus(400);
  const contact = detailContact(nama);
  if (!contact) return res.send(`contact ${nama} tidak di temukan.`);
  res.render("detail", {
    title: "Halaman Detail Contact",
    contact,
  });
});

//
app.get("/add-contact", (req, res) => {
  res.render("add-contact", {
    title: "halaman tambah contact",
  });
});

// not Found URL
app.use((req, res) => {
  res.status(404);
  res.end("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`app in run http://localhost:${port} `);
});
