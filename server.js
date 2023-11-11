const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: path.join(__dirname, 'views/layouts'), defaultLayout: 'main' }));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Folder, gdzie będą zapisywane pliki
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/contact/send-message', upload.single('file'), (req, res) => {
  const { author, sender, title, message } = req.body;
  const fileName = req.file ? req.file.originalname : '';

  if (author && sender && title && message && fileName) {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', fileName);

    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.error(err);
        res.render('contact', { isError: true });
      } else {
        res.render('contact', { isSent: true, fileName });
      }
    });
  } else {
    res.render('contact', { isError: true });
  }
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});