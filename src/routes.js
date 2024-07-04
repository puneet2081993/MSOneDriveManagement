const express = require('express');
const router = express.Router();
const AuthController = require('./controllers/login');
const UserProfileService = require('./controllers/user');
const FilesController = require('./controllers/files');

const authController = new AuthController();

const filesController = new FilesController();

const userProfileService = new UserProfileService();


// Route to start the login process
router.get('/login', authController.getAuthorizeUrl);

// Route to handle the callback after the login process
router.get('/auth/callback', authController.getToken);

// Route to get user profile
router.get('/profile', userProfileService.getUserProfile);

// Route to create a subscription
router.post('/create/subscription', userProfileService.createSubscription);

// Route to get user files
router.get('/list/files', filesController.fetchFiles);

// Route to download a file
router.get('/download/file/:itemId', filesController.downloadFile);

// Route to get file access
router.get('/file/access/:itemId', filesController.getFileAccess);

// Route to get file access
router.post('/webhook', userProfileService.handleWebhook);

module.exports = router;