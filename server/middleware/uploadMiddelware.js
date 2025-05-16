  const multer = require("multer");
  const upload = multer({ dest: "upload/" });

  exports.uploadMiddleware = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "preview", maxCount: 5 }
  ]);
