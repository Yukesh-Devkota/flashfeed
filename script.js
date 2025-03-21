// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Follower count animation (replace 500 with your actual follower count)
const followerNumber = document.getElementById('follower-number');
let count = 0;
const targetCount = 164798; // Replace with your actual follower count from https://www.facebook.com/Yukeshdevkota12
const duration = 2000; // Animation duration in milliseconds
const increment = targetCount / (duration / 50);

function animateCount() {
    count += increment;
    if (count >= targetCount) {
        count = targetCount;
        clearInterval(counter);
    }
    followerNumber.textContent = Math.floor(count).toLocaleString(); // Adds commas for readability
}

const counter = setInterval(animateCount, 50);