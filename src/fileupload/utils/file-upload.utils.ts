import { extname } from 'path';

export const editFileName = (
  req: any,
  file: { originalname: string },
  callback: (arg0: null, arg1: string) => void,
) => {
  const editFileName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${editFileName}${extname(file.originalname)}`);
};
