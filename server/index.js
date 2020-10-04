const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const upload = require('./upload');
const mime = require('mime-types');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'templates', 'views'));

app.use(express.json());

app.get('/', async (_req, res) => {
    res.render('index');
});

app.use('/static', express.static(path.join(__dirname, '..', 'static')));

app.get('/search', async (req, res) => {
    const { q, mode } = req.query;

    let files = await fs.readdir(
        path.join(__dirname, '..', 'static', 'uploads')
    );

    if (mode === 'regex'){
        const regex = new RegExp(q);
        files = files.filter(f => f.match(regex));
    }
    else {
        files = files.filter(f => f.search(q) !== -1);
    }

    return res.render('search', { files });
});

app.get('/lucky', async (_req, res) => {
    const files = await fs.readdir(
        path.join(__dirname, '..', 'static', 'uploads')
    );

    if (!files.length){
        return res.json({
            file: null,
            ext: null
        });
    }

    const index = Math.floor(Math.random() * files.length);

    const file = files[index];

    const type = mime.lookup(file);

    return res.json({
        file, type
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    return res.send('Arquivo enviado com sucesso');
});

app.listen(3000, () => {
    console.log('Server started');
});
