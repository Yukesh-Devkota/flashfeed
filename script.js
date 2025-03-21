// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Follower count handling
const followerNumber = document.getElementById('follower-number');
if (followerNumber) {
    const fallbackCount = 164798;

    function animateCount(targetCount) {
        let count = 0;
        const duration = 2000;
        const increment = targetCount / (duration / 50);

        function updateCount() {
            count += increment;
            if (count >= targetCount) {
                count = targetCount;
                clearInterval(counter);
            }
            followerNumber.textContent = Math.floor(count).toLocaleString('en-US');
        }

        const counter = setInterval(updateCount, 50);
    }

    async function fetchFollowerCount() {
        try {
            console.log('Fetching follower count from /api/followers');
            const response = await fetch('/api/followers');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            if (data.error) {
                console.error('API Endpoint Error:', data.error);
                return fallbackCount;
            }
            const count = data.count || fallbackCount;
            console.log('Received Count:', count);
            return count;
        } catch (error) {
            console.error('Client Fetch Error:', error.message);
            return fallbackCount;
        }
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            fetchFollowerCount().then(targetCount => {
                animateCount(targetCount);
            }).catch((error) => {
                console.error('Unexpected Error:', error);
                animateCount(fallbackCount);
            });
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(followerNumber);
}
