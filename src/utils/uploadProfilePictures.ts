import { Request} from "express";
import multer from "multer";
import path from "path";

const diskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "../..", "uploads", "avatars"));
  },
  filename: function (_req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(new Error("file type not resolved"));
  }
};

const uploadProfilePicture = multer({
  storage: diskStorage,
  fileFilter,
});

export default uploadProfilePicture;
