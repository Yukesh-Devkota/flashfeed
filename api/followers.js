require('dotenv').config();

export default async function handler(req, res) {
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pageId = 'Yukeshdevkota12';
    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=followers_count&access_token=${accessToken}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        res.status(200).json({ count: data.followers_count || 164798 });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ count: 164798 });
    }
}