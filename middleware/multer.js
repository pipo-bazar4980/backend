const multer = require('multer');

const multerStorage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, 'media/img'); 
    },
    filename: function (req, file, cb) { 
        const ext = file.mimetype.split("/")[1]; 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${file.originalname.split(".")[0]}-${uniqueSuffix}.${ext}`;
        console.log(filename)
        cb(null, filename);
    }
})

const upload=multer({ 
    storage: multerStorage
})

module.exports=upload

