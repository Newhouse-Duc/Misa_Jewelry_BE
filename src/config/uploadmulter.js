import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {

        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const uploadmulter = multer({ storage });

export default uploadmulter;