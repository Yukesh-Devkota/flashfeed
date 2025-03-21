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

// Follower count animation
const followerNumber = document.getElementById('follower-number');
if (followerNumber) { // Check if element exists
    let count = 0;
    const targetCount = 164798; // Your Facebook follower count as of now
    const duration = 2000; // Animation duration in milliseconds
    const increment = targetCount / (duration / 50); // Steps per frame

    function animateCount() {
        count += increment;
        if (count >= targetCount) {
            count = targetCount;
            clearInterval(counter);
        }
        followerNumber.textContent = Math.floor(count).toLocaleString('en-US'); // Localized formatting
    }

    // Start animation when element is in view
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const counter = setInterval(animateCount, 50);
            observer.disconnect(); // Stop observing after starting
        }
    }, { threshold: 0.5 }); // Trigger when 50% of element is visible

    observer.observe(followerNumber);
}
