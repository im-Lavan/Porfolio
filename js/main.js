document.addEventListener('DOMContentLoaded', function() {
    const botIcon = document.getElementById('botIcon');
    const headline = document.querySelector('.headline');
    
    if (botIcon && headline && window.innerWidth > 768) {
        let animationFrameId = null;
        
        function updateBotPosition(e) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            animationFrameId = requestAnimationFrame(() => {
                const headlineRect = headline.getBoundingClientRect();
                const headlineCenter = {
                    x: headlineRect.left + headlineRect.width / 2,
                    y: headlineRect.top + headlineRect.height / 2
                };
                
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                const deltaX = mouseX - headlineCenter.x;
                const deltaY = mouseY - headlineCenter.y;
                
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDistance = 300;
                
                if (distance < maxDistance) {
                    const intensity = 1 - (distance / maxDistance);
                    
                    const maxRotation = 15;
                    const maxTilt = 10;
                    
                    const rotationZ = (deltaX / maxDistance) * maxRotation * intensity;
                    const rotationX = -(deltaY / maxDistance) * maxTilt * intensity;
                    
                    botIcon.style.transform = `translateX(-50%) rotateZ(${rotationZ}deg) rotateX(${rotationX}deg)`;
                } else {
                    botIcon.style.transform = 'translateX(-50%) rotateZ(0deg) rotateX(0deg)';
                }
            });
        }
        
        document.addEventListener('mousemove', updateBotPosition);
        
        headline.addEventListener('mouseleave', function() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            botIcon.style.transform = 'translateX(-50%) rotateZ(0deg) rotateX(0deg)';
        });
    }
});
// Certifications Carousel
(function() {
    const track = document.getElementById('certsTrack');
    const prevBtn = document.getElementById('certsPrev');
    const nextBtn = document.getElementById('certsNext');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const cards = track.querySelectorAll('.cert-card');
    let itemsPerView = window.innerWidth > 768 ? 2 : 1;
    
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // 2rem in pixels
        const offset = -(currentIndex * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - itemsPerView;
    }
    
    function updateItemsPerView() {
        itemsPerView = window.innerWidth > 768 ? 2 : 1;
        currentIndex = 0;
        updateCarousel();
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    window.addEventListener('resize', updateItemsPerView);
    updateItemsPerView();
})();

// Contact Form Handler with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const statusDiv = document.getElementById('formStatus');
            const submitBtn = document.getElementById('submitBtn');
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusDiv.textContent = '';
            statusDiv.className = 'form-status';
            
            // Replace these with your actual IDs from EmailJS
            const serviceID = 'service_uc59ga6';      // Get this from EmailJS dashboard
            const templateID = 'template_yq4jdfp';    // Get this from EmailJS dashboard (the notification template)
            
            // Send email using EmailJS
            emailjs.sendForm(serviceID, templateID, this)
                .then(function() {
                    statusDiv.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                    statusDiv.classList.add('success');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        statusDiv.style.display = 'none';
                    }, 5000);
                }, function(error) {
                    statusDiv.textContent = '✗ Failed to send message. Please email me directly at imlavansivakumar@gmail.com';
                    statusDiv.classList.add('error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    console.error('EmailJS error:', error);
                });
        });
    }
});