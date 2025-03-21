export default async function handler(req, res) {
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pageId = 'Yukeshdevkota12'; // Replace with your actual Page ID
    const fallbackCount = 164798;

    // Check for token presence
    if (!accessToken) {
        console.error('No FB_ACCESS_TOKEN found in environment variables');
        return res.status(500).json({ count: fallbackCount, error: 'Missing FB_ACCESS_TOKEN in environment variables' });
    }

    try {
        const url = `https://graph.facebook.com/v19.0/${pageId}?fields=followers_count&access_token=${accessToken}`;
        console.log('Attempting to fetch from Facebook API:', url.replace(accessToken, '[HIDDEN_TOKEN]')); // Hide token in logs
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Facebook API HTTP Error:', response.status, errorText);
            return res.status(500).json({ count: fallbackCount, error: `Facebook API failed with status ${response.status}: ${errorText}` });
        }

        const data = await response.json();
        if (data.error) {
            console.error('Facebook API Response Error:', data.error);
            return res.status(200).json({ count: fallbackCount, error: data.error.message });
        }

        const count = data.followers_count || fallbackCount;
        console.log('Successful API Response:', { id: data.id, followers_count: data.followers_count });
        return res.status(200).json({ count });
    } catch (error) {
        console.error('Server Fetch Error:', error.message);
        return res.status(500).json({ count: fallbackCount, error: `Fetch error: ${error.message}` });
    }
}
