// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') { // Check for valid href
            const target = document.querySelector(href);
            if (target) { // Ensure target exists
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Follower count handling
const followerNumber = document.getElementById('follower-number');
if (followerNumber) {
    // Facebook Graph API settings
    const accessToken = 'EAAJyBBRddHgBOwcKP4lCqlbq33v5CVxPUk0JXvyhVbXLamXZB9meDKyD47wUWZCEBaAx7lO3xd2lXHX3DE33X5mjWFpBela8rYv65MyYzSnycGANqB6aoZBWYTT3JyfmKIiZBxSiXs4b7ZCKzBshIcbSN5hqUOAtZBDxJFRqDQGba77N6mTgbL74PmjjCmzYHKaokRupIVMVQImZAE2gsasS5esXukZD';
    const pageId = 'Yukeshdevkota12'; // Replace with your actual Page ID if different
    const fallbackCount = 164798; // Fallback if API fails (your provided count)

    // Animation function
    function animateCount(targetCount) {
        let count = 0;
        const duration = 2000; // Animation duration in milliseconds
        const increment = targetCount / (duration / 50); // Steps per frame

        function updateCount() {
            count += increment;
            if (count >= targetCount) {
                count = targetCount;
                clearInterval(counter);
            }
            followerNumber.textContent = Math.floor(count).toLocaleString('en-US'); // Localized formatting
        }

        const counter = setInterval(updateCount, 50);
    }

    // Fetch follower count from Facebook Graph API
    async function fetchFollowerCount() {
        try {
            const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=followers_count&access_token=${accessToken}`);
            const data = await response.json();
            if (data.error) {
                console.error('API Error:', data.error.message);
                return fallbackCount; // Use fallback on error
            }
            return data.followers_count || fallbackCount; // Return API count or fallback
        } catch (error) {
            console.error('Fetch Error:', error);
            return fallbackCount; // Use fallback on network failure
        }
    }

    // Start animation when element is in view
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            fetchFollowerCount().then(targetCount => {
                animateCount(targetCount);
            }).catch(() => {
                animateCount(fallbackCount); // Ultimate fallback
            });
            observer.disconnect(); // Stop observing after starting
        }
    }, { threshold: 0.5 }); // Trigger when 50% of element is visible

    observer.observe(followerNumber);
}

// Security warning (console only, not affecting functionality)
console.warn('Note: Exposing your access token client-side is insecure. For production, use a server-side API to hide the token.');
