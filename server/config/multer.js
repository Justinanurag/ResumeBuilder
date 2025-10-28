import multer from 'multer';
const storage =multer.diskStorage({});
const uplaod=multer({storage})

export default uplaod