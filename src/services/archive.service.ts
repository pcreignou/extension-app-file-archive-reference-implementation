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
  console.log( '### folder: '+ file.path);
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
      const formData = new FormData();
      
      // Ensure the file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
      // Create a readable stream from the file path
      const fileStream = fs.createReadStream(filePath);
  
      // Append file to the form data with 'file' as the key
      formData.append('file', fileStream, {
        filename: file.name, // Optional: Specify the filename
        contentType: file.contentType, // Optional: Specify content type
      });
      formData.append("options", JSON.stringify({
        access: "PUBLIC_INDEXABLE" // Can be PRIVATE, PUBLIC_INDEXABLE, etc.        
    }));
    if (file.path) {
      formData.append("folderPath", file.path);
      }

      

  
      // HubSpot File Upload API endpoint
      const url = `https://api.hubapi.com/files/v3/files`;
  
           // Generate headers (boundary auto-calculated)
           const headers = {
            Authorization:  req.headers.authorization,
            ...formData.getHeaders(), // Includes Content-Type with boundary
        };

        // Log the request headers
        console.log("📌 Request Headers:", headers);

        // Log the request body (Warning: Large files will be a stream, not printed in full)
        console.log("📌 Request Body (FormData Fields):", formData.getBuffer().toString());

        // Upload file using Axios
        const response = await axios.post(url, formData, { headers });
  
      console.log('File uploaded successfully:', response.data); 

  

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
