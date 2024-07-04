const axios = require('axios');
const fs = require('fs');
const path = require('path');


class FilesController {

  async fetchFiles(req, res) {
    try {
      const apiUrl = `${process.env.MS_BASE_URL}/me/drive/root/children`;
      const accessToken = req.session.accessToken;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data.value) {
        throw new Error('No files found');
      }

      const resultRs = response.data.value;

      console.log(JSON.stringify(resultRs));

      const filesData = resultRs.map(files => ({
        fileId: files.id,
        fileName: files.name,
        createdDateTime: files.createdDateTime,
        lastModifiedDateTime: files.lastModifiedDateTime,
        size: files.size,
        createdBy: files.createdBy.user.displayName,
        webUrl: files.webUrl,
      }));

      res.json(filesData);

    } catch (error) {
      if (error.response) {
        console.log(`Error fetching files: ${error.response.data.error}`);
      } else {
        console.log(`Error fetching files: ${error.message}`);
      }
      res.status(500).send('Error fetching files');
    }
  }

  async downloadFile(req, res) {
    try {
      const { itemId } = req.params;
      const apiUrl = `${process.env.MS_BASE_URL}/me/drive/items/${itemId}`;
      const accessToken = req.session.accessToken;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const downloadUrl = response.data['@microsoft.graph.downloadUrl'];

      if (!downloadUrl) {
        throw new Error('Download URL not found in API response');
      }


      const fileResponse = await axios.get(downloadUrl, {
        responseType: 'stream',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      });

      const fileName = response.data.name;
      const filePath = `./downloads/${fileName}`;

      const writer = fs.createWriteStream(filePath);
      fileResponse.data.pipe(writer);

      writer.on('finish', () => {
        console.log('File downloaded successfully');
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error sending file to client:', err);
                res.status(500).send('Error sending file to client');
            } else {
                fs.unlinkSync(filePath);
            }
        });
      });

      writer.on('error', (err) => {
          console.error('Error saving file:', err);
          res.status(500).send('Error saving file');
      });

    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Error downloading file');
    }
  }

  async getFileAccess(req, res) {
    try {
      const { itemId } = req.params;
      const apiUrl = `${process.env.MS_BASE_URL}/me/drive/items/${itemId}/permissions`;
      const accessToken = req.session.accessToken;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data.value) {
        throw new Error('No Users found for this file');
      }

      const resultRs = response.data.value;

      const usersWithAccess = resultRs.map(permission => ({
        id: permission.id,
        displayName: permission.grantedTo.user.id,
        role: permission.roles[0], // Assuming each permission has a single role
      }));

      res.json(usersWithAccess);
    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Error fetching file permissions');
    }
  }
    
}

module.exports = FilesController;