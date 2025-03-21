export default async function handler(req, res) {
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pageId = 'Yukeshdevkota12'; // Replace if needed
    const fallbackCount = 164798;

    if (!accessToken) {
        console.error('No FB_ACCESS_TOKEN found in environment variables');
        return res.status(500).json({ count: fallbackCount, error: 'Missing access token' });
    }

    try {
        const url = `https://graph.facebook.com/v19.0/${pageId}?fields=followers_count&access_token=${accessToken}`;
        console.log('Fetching from:', url);
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('Facebook API Error:', data.error);
            return res.status(200).json({ count: fallbackCount, error: data.error.message });
        }

        const count = data.followers_count || fallbackCount;
        console.log('API Response:', { id: data.id, followers_count: data.followers_count });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Server Fetch Error:', error.message);
        res.status(500).json({ count: fallbackCount, error: error.message });
    }
}