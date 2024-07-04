const axios = require('axios');

class UserProfileService {

  async getUserProfile(req, res) {
    try {
      const apiUrl = process.env.MS_BASE_URL + '/me';
      const accessToken = req.session.accessToken;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Profile Details:', response.data);

      if (!response.data.id) {
        throw new Error('No profile found');
      }

      const resultRs = {
        userId: response.data.id,
        displayName: response.data.displayName,
        email: response.data.mail || response.data.userPrincipalName,
        jobTitle: response.data.jobTitle,
        mobilePhone: response.data.mobilePhone,
      } || {};

      res.json(resultRs);
    } catch (error) {
      console.log('Error fetching profile:', error);
      res.status(500).json({ error: 'Error fetching profile' });
    }
  }

  async createSubscription(req, res) {
    const accessToken = req.session.accessToken;
    const subscriptionUrl = `${process.env.MS_BASE_URL}/subscriptions`;

    const subscriptionData = {
      "changeType": "updated",
      "notificationUrl": process.env.WEBHOOK_URL, // use the https url of your server
      "resource": "/me/drive/root",
      "expirationDateTime":"2024-12-20T18:23:45.9356913Z",
    };

    console.log('subscriptionData...', subscriptionData);

    try {
        const response = await axios.post(subscriptionUrl, subscriptionData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Subscription created:', response.data);

        res.json(response.data);

    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Error creating subscription' });
    }
  }

  async handleWebhook(req, res) {
    try {
      console.log('Webhook request:', req.body);
      res.status(200).send({ value: 'Webhook received', body: req.body });
    } catch (error) {
      console.log('Error:', error);
      res.status(200).send({ value: 'Webhook received'});
    }
  }
}

module.exports = UserProfileService;
