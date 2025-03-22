// Custom smooth scroll function
function smoothScroll(target, duration) {
    const start = window.pageYOffset;
    const distance = target.getBoundingClientRect().top;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function for smooth acceleration/deceleration
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Apply smooth scroll to navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                smoothScroll(target, 1000); // 1000ms = 1 second duration
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
