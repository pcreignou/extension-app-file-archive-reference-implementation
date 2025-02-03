import path from 'path';
import { ArchiveFileBody, ArchiveFileResponse } from '../models/archive';
import { IReq, IRes } from '../utils/types';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import FormData from 'form-data';


export const archiveFile = async (req: IReq<ArchiveFileBody>, res: IRes) => {
  const {
    body: {
      files: [file],
    },
  } = req;
  console.log( '### auth token: '+ req.headers.authorization);
  console.log( '### storing: '+ file.name);
  console.log( '### Values: '+ file.pathTemplateValues)
  const fileBuffer = Buffer.from(file.content, 'base64');
  const HUBSPOT_API_KEY ='51153ca7-c22e-4202-b794-6889ecef7706';


  try {
    if (file.path) {
      fs.mkdirSync(file.path, { recursive: true });
    }
    fs.writeFileSync(path.join(file.path, file.name), fileBuffer);

      const filePath=path.join(file.path, file.name);
      // Initialize FormData to send file as multipart form data
      const form = new FormData();
  
      // Create a readable stream from the file path
      const fileStream = fs.createReadStream(filePath);
  
      // Append file to the form data with 'file' as the key
      form.append('file', fileStream, {
        filename: file.name, // Optional: Specify the filename
        contentType: file.contentType, // Optional: Specify content type
      });
  
      // HubSpot File Upload API endpoint
      const url = `https://api.hubapi.com/filemanager/api/v3/files/upload?hapikey=${HUBSPOT_API_KEY}`;
  
      // Make the POST request to upload the file
      const response: AxiosResponse = await axios.post(url, form, {
        headers: {
          'Authorization':req.headers.authorization,
        },
      });
  
      console.log('File uploaded successfully:', response.data); 

  

    const archiveResult: ArchiveFileResponse = { message: 'Successful archive' };
    return res.json(archiveResult);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Error uploading file:', err.response?.data || err.message);
    } else {
      console.log(`Encountered an error archiving file: ${err.message}`)
    };
    const archiveResult: ArchiveFileResponse = { message: 'Failed archive' };
    return res.json(archiveResult);
  }
};
