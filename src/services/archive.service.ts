import path from 'path';
import { ArchiveFileBody, ArchiveFileResponse } from '../models/archive';
import { IReq, IRes } from '../utils/types';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';



export const archiveFile = async (req: IReq<ArchiveFileBody>, res: IRes) => {
  const {
    body: {
      files: [file],
    },
  } = req;
  console.log( '### auth token: '+ req.headers.authorization);
  console.log( '### storing: '+ file.name);
  console.log( '### folder: '+ file.path);
  console.log( '### Values: '+ file.pathTemplateValues)
  const fileBuffer = Buffer.from(file.content, 'base64');
;
  const HUBSPOT_UPLOAD_URL = 'https://api.hubapi.com/files/v3/files';


  try {
    if (file.path) {
      fs.mkdirSync(file.path, { recursive: true });
    }
    fs.writeFileSync(path.join(file.path, file.name), fileBuffer);

      const filePath=path.join(file.path, file.name);
      // Initialize FormData to send file as multipart form data
     
      
      // Ensure the file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
       // Ensure the file exists
       if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const options = JSON.stringify({
        access: 'PUBLIC_INDEXABLE', // Options: PRIVATE, PUBLIC_NOT_INDEXABLE, PUBLIC_INDEXABLE
    });

    // Manually create multipart body and headers
    const { bodyBuffer, headers } = createMultipartBody(req,filePath, file.name, options, file.path);

    // Log headers and body for debugging
    console.log('📌 Request Headers:', headers);
    console.log('📌 Request Body:', bodyBuffer);

    // Send the request
    const response = await axios.post(HUBSPOT_UPLOAD_URL, bodyBuffer, { headers });

    console.log('✅ File uploaded successfully:', response.data); 

    const archiveResult: ArchiveFileResponse = { message: 'Successful archive' };
    return res.json(archiveResult);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Error uploading file:', err.message);
    } else {
      console.log(`Encountered an error archiving file: ${err.message}`)
    };
    const archiveResult: ArchiveFileResponse = { message: 'Failed archive' };
    return res.json(archiveResult);
  }
};

const createMultipartBody = ( req:IReq<ArchiveFileBody>,filePath: string, fileName: string, options: string, folderPath?: string) => {
  const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
  const fileBuffer = getFileBuffer(filePath);
  const filePart = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n${fileBuffer.toString('binary')}\r\n`;
  const optionsPart = `--${boundary}\r\nContent-Disposition: form-data; name="options"\r\n\r\n${options}\r\n`;
  const folderPathPart = folderPath
      ? `--${boundary}\r\nContent-Disposition: form-data; name="folderPath"\r\n\r\n${folderPath}\r\n`
      : '';

  const endBoundary = `--${boundary}--\r\n`;

  const body = `${filePart}${optionsPart}${folderPathPart}${endBoundary}`;
  const bodyBuffer = Buffer.from(body, 'binary');

  const headers = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': bodyBuffer.length,
      Authorization: req.headers.authorization,
  };

  return { bodyBuffer, headers };
};
const getFileBuffer = (filePath: string): Buffer => {
  return fs.readFileSync(filePath);
};

