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
    const fallbackCount = 164798; // Fallback if API fails

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
            const response = await fetch('/api/followers');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.count || fallbackCount;
        } catch (error) {
            console.error('Fetch Error:', error);
            return fallbackCount;
        }
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            fetchFollowerCount().then(targetCount => {
                animateCount(targetCount);
            }).catch(() => {
                animateCount(fallbackCount);
            });
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(followerNumber);
}