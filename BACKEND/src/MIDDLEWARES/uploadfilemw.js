import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req,file,callback){
        console.log("file",file)
        callback(null,file.originalname);
    },
});

export const upload = multer({storage: storage});

///product images or other file upload middleware