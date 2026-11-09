import { NotAcceptableException, } from '@nestjs/common';
import axios from 'axios';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new NotAcceptableException('Only Jpg, jpeg, png files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const audioFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp3)$/)) {
    return callback(
      new NotAcceptableException('Only mp3 file are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const videoFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp4)$/)) {
    return callback(
      new NotAcceptableException('Only mp4 file are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const pdfFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(
      new NotAcceptableException('Only pdf file are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export async function uploadFileHandler(name, buffer) {
  try {
    const newBuffer = Buffer.from(buffer.toString('binary'), 'binary');
    const payload = await axios.put(
      process.env.STN_CDN_STORAGE + name,
      newBuffer,
      { headers: { AccessKey: process.env.STN_CDN_ACCESS } },
    );
    return payload.data;
  } catch (error) {
    return { HttpCode: 405 };
  }
}

export async function deleteFileHandler(name) {
  try {
    const payload = await axios.delete(process.env.STN_CDN_STORAGE + name, {
      headers: { AccessKey: process.env.STN_CDN_ACCESS },
    });
    return payload.data;
  } catch (error) {
    return { HttpCode: 405 };
  }
}
