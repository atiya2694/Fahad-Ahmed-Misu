// Testimonial slider functionality
const testimonials = document.querySelectorAll('.testimonial-card');
let activeIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
}

document.getElementById('prevTestimonial').addEventListener('click', () => {
  activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(activeIndex);
});

document.getElementById('nextTestimonial').addEventListener('click', () => {
  activeIndex = (activeIndex + 1) % testimonials.length;
  showTestimonial(activeIndex);
});

showTestimonial(activeIndex);

// Contact form functionality (frontend only)
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('formResponse').textContent = "Thank you for reaching out! I'll respond soon.";
  this.reset();
});
