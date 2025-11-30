import { diskStorage } from 'multer';

export const multerOption = (destination:string) => {
  const storage = diskStorage({
    destination,
    filename: (req, file, cb) => {
      const uniqueFilename = Date.now() + '-' + file.originalname;
      cb(null, uniqueFilename);
    },
  });

  return storage;
};
