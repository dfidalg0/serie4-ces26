const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const upload = require('./upload');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.json());

app.get('/', async (_req, res) => {
    res.render('index');
});

app.use('/static', express.static(path.join(__dirname, '..', 'static')));

app.get('/search', async (req, res) => {
    const { q } = req.query;

    const regex = new RegExp(q);

    const files = (await fs.readdir(
        path.join(__dirname, '..', 'static', 'uploads')
    )).filter(f => f.match(regex));

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

    const split = file.split('.');

    const ext = split[split.length - 1];

    let type;

    switch (ext.toLowerCase()) {
        case 'txt':
        case 'js':
        case 'ts':
        case 'html':
        case 'css':
        case 'py': type = 'text'; break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
        case 'gif': type = 'image'; break;
        case 'pdf':
        case 'doc':
        case 'docx': type = 'document'; break;
        default: type = 'unknown'; break;
    }

    return res.json({
        file, type
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    return res.send(':D');
});

app.listen(3000, () => {
    console.log('Server started');
});
