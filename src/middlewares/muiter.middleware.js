import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ".public/temp")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ storage: storage })

//explanation of the above code

//What this code does (summary)
//Creates a Multer disk storage engine that writes uploaded files to disk.
//Chooses the destination directory for saved files.
//Generates a unique filename for each uploaded file.
//Creates a Multer middleware instance (upload) that you can use in Express routes.