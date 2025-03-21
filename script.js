// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// CTA button click effect
document.querySelector('.cta').addEventListener('click', () => {
    alert('Dive into FlashFeed’s universe!');
});