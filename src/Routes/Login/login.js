import express from "express";
import axios from "axios";
import querystring from "querystring";
import cors from "cors";

const router = express.Router();

function generateRandomString(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

router.get("/signin", cors(), async (req, res) => {
	try {
		const state = generateRandomString(16);
		const scope = 'user-read-private user-read-email';

		const authUrl = 'https://accounts.spotify.com/authorize?' +
			querystring.stringify({
				response_type: 'code',
				client_id: process.env.SPOTIFY_CLIENT_ID,
				scope: scope,
				redirect_uri: `${process.env.DOMAIN_URL}/api/auth/callback`,
				state: state
			});

		res.status(200).json({ authUrl });
	} catch (error) {
		console.error('Spotify auth error:', error);
		res.status(500).json({ error: 'Authentication failed' });
	}
});

router.get('/callback', async function (req, res) {

	var code = req.query.code || null;
	var state = req.query.state || null;

	if (state === null) {
		res.status(500).json({ error: 'state is required' });
	} else {
		const authOptions = {
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
			},
			data: querystring.stringify({
				code: code,
				redirect_uri: `${process.env.DOMAIN_URL}/api/auth/callback`,
				grant_type: 'authorization_code'
			})
		};

		try {
			const response = await axios(authOptions);
			const { access_token, refresh_token } = response.data;
			res.redirect(`${process.env.WEB_URL}/?` +
				querystring.stringify({
					access_token: access_token,
				})
			);
		} catch (error) {
			console.error('Spotify authentication error:', error.response?.data || error.message);
			res.redirect(`${process.env.WEB_URL}/?` +
				querystring.stringify({
					error: 'invalid_token'
				})
			);
		}
	}
});

export default router;
