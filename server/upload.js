const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'static/uploads',
    filename(_req, file, cb){
        cb(null, `${decodeURI(file.originalname)}`);
    }
});

module.exports = multer({ storage });
