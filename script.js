// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Dropdown click functionality
const navDropdowns = document.querySelectorAll('.nav-dropdown');

navDropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('.nav-link');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    
    // Toggle dropdown on click
    if (dropdownLink && dropdownMenu) {
        dropdownLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close other dropdowns
            navDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
        navDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Close dropdown when clicking a menu item
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links with Apple-style easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            smoothScrollTo(offsetTop, 1000);
        }
    });
});

// Apple-style smooth scroll function
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, start + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Duration Controls Handler
const durationSlider = document.getElementById('duration-slider');
const durationInput = document.getElementById('duration-input');
const quickDurationButtons = document.querySelectorAll('.quick-duration-btn');

// Sync slider and input
function updateDuration(value) {
    const numValue = parseInt(value);
    if (numValue < 3) value = '3';
    if (numValue > 60) value = '60';
    
    if (durationSlider) durationSlider.value = value;
    if (durationInput) durationInput.value = value;
    
    // Update quick buttons
    quickDurationButtons.forEach(btn => {
        if (btn.getAttribute('data-duration') === value) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

if (durationSlider && durationInput) {
    // Slider updates input
    durationSlider.addEventListener('input', (e) => {
        updateDuration(e.target.value);
    });
    
    // Input updates slider
    durationInput.addEventListener('input', (e) => {
        let value = e.target.value;
        if (value === '') return;
        updateDuration(value);
    });
    
    // Validate input on blur
    durationInput.addEventListener('blur', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 3) {
            value = 3;
        } else if (value > 60) {
            value = 60;
        }
        updateDuration(value);
    });
}

// Quick duration buttons
quickDurationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const duration = btn.getAttribute('data-duration');
        updateDuration(duration);
        
        // Visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    });
});

// Aspect Ratio Controls Handler
const aspectRatioButtons = document.querySelectorAll('.aspect-ratio-btn');
const ratioWidthInput = document.getElementById('ratio-width');
const ratioHeightInput = document.getElementById('ratio-height');
const applyCustomRatioBtn = document.getElementById('apply-custom-ratio');
let selectedRatio = '16:9';

// Update custom ratio inputs when preset is selected
function updateCustomRatioInputs(ratio) {
    const [width, height] = ratio.split(':');
    if (ratioWidthInput) ratioWidthInput.value = width;
    if (ratioHeightInput) ratioHeightInput.value = height;
}

// Aspect ratio button clicks
aspectRatioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        aspectRatioButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        selectedRatio = btn.getAttribute('data-ratio');
        
        // Update custom inputs
        updateCustomRatioInputs(selectedRatio);
        
        // Smooth animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    });
});

// Custom ratio input handler
if (applyCustomRatioBtn && ratioWidthInput && ratioHeightInput) {
    function applyCustomRatio() {
        const width = ratioWidthInput.value;
        const height = ratioHeightInput.value;
        
        if (!width || !height || width < 1 || height < 1) {
            showNotification('Please enter valid ratio values (1-32)', 'error');
            return;
        }
        
        const customRatio = `${width}:${height}`;
        selectedRatio = customRatio;
        
        // Remove active from preset buttons
        aspectRatioButtons.forEach(b => b.classList.remove('active'));
        
        // Show success
        showNotification(`Custom ratio ${customRatio} applied`, 'success');
        
        // Visual feedback
        applyCustomRatioBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            applyCustomRatioBtn.style.transform = '';
        }, 150);
    }
    
    applyCustomRatioBtn.addEventListener('click', applyCustomRatio);
    
    // Allow Enter key to apply
    [ratioWidthInput, ratioHeightInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyCustomRatio();
            }
        });
    });
    
    // Auto-update when typing (debounced)
    let updateTimeout;
    [ratioWidthInput, ratioHeightInput].forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                // Remove active from presets when typing custom
                aspectRatioButtons.forEach(b => b.classList.remove('active'));
            }, 500);
        });
    });
}

// Prompt Input Character Counter
const promptInput = document.getElementById('prompt-input');
const charCount = document.getElementById('char-count');
const maxChars = 3500;

if (promptInput && charCount) {
    promptInput.addEventListener('input', () => {
        const currentLength = promptInput.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength > maxChars) {
            charCount.style.color = '#ef4444';
            promptInput.value = promptInput.value.substring(0, maxChars);
            charCount.textContent = maxChars;
        } else if (currentLength > maxChars * 0.9) {
            charCount.style.color = '#fbbf24';
        } else {
            charCount.style.color = '';
        }
    });
}

// Clear Prompt Button
const clearBtn = document.querySelector('.btn-clear');
if (clearBtn && promptInput) {
    clearBtn.addEventListener('click', () => {
        promptInput.value = '';
        charCount.textContent = '0';
        promptInput.focus();
    });
}

// Smart Expand Button
const smartExpandBtn = document.querySelector('.btn-smart-expand');
if (smartExpandBtn && promptInput) {
    smartExpandBtn.addEventListener('click', () => {
        // Example: Add common video editing prompts
        const examples = [
            'Add smooth transitions between scenes, apply cinematic color grading, and sync background music',
            'Cut out silent parts, add dynamic text overlays, and enhance audio quality',
            'Create a fast-paced montage with energetic music, apply color filters, and add zoom effects'
        ];
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        promptInput.value = randomExample;
        promptInput.dispatchEvent(new Event('input'));
        promptInput.focus();
    });
}

// Generate Button Handler with smooth animations
const generateBtn = document.querySelector('.btn-generate');
const previewContainer = document.querySelector('.preview-container');
const previewPlaceholder = document.querySelector('.preview-placeholder');

// Add ripple effect class
if (generateBtn) {
    generateBtn.classList.add('btn-ripple');
}

if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!promptInput || !promptInput.value.trim()) {
            showNotification('Please enter a description of your video edit!', 'error');
            promptInput.focus();
            // Add shake animation
            promptInput.parentElement.style.animation = 'shake 0.5s';
            setTimeout(() => {
                promptInput.parentElement.style.animation = '';
            }, 500);
            return;
        }

        // Get selected values
        const duration = durationInput ? durationInput.value : (durationSlider ? durationSlider.value : '5');
        const aspectRatio = selectedRatio || '16:9';
        const audioEnabled = document.getElementById('audio-toggle')?.checked || false;
        
        console.log('Generation settings:', { duration, aspectRatio, audioEnabled });
        
        // Show settings in notification
        showNotification(`Generating ${duration}s video at ${aspectRatio} ratio${audioEnabled ? ' with audio' : ''}...`, 'info');

        // Show loading state with smooth transition
        generateBtn.disabled = true;
        generateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            generateBtn.innerHTML = '<span>⏳</span> Generating...';
            generateBtn.style.transform = 'scale(1)';
        }, 150);
        
        // Add loading shimmer to preview
        if (previewContainer) {
            previewContainer.classList.add('loading');
        }
        
        // Simulate video generation with progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                if (previewPlaceholder) {
                    previewPlaceholder.innerHTML = `
                        <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
                        <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                            Generating your video...
                        </p>
                        <div style="width: 200px; height: 4px; background: var(--border-color); border-radius: 2px; margin: 0 auto;">
                            <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, var(--accent-purple), var(--accent-cyan)); border-radius: 2px; transition: width 0.3s;"></div>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">${progress}%</p>
                    `;
                }
            }
        }, 200);
        
        setTimeout(() => {
            clearInterval(progressInterval);
            
            // Remove loading class
            if (previewContainer) {
                previewContainer.classList.remove('loading');
            }
            
            // Success animation
            if (previewPlaceholder) {
                previewPlaceholder.style.opacity = '0';
                previewPlaceholder.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    previewPlaceholder.innerHTML = `
                        <div style="font-size: 3rem; margin-bottom: 1rem; animation: scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);">✅</div>
                        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.5rem; animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                            Video Generated Successfully!
                        </p>
                        <p style="font-size: 0.875rem; color: var(--text-muted); animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both;">
                            Your edited video is ready. Click to preview.
                        </p>
                    `;
                    previewPlaceholder.style.opacity = '1';
                    previewPlaceholder.style.transform = 'scale(1)';
                }, 200);
            }
            
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span>⚡</span> Generate Free';
            generateBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                generateBtn.style.transform = 'scale(1)';
            }, 200);
            
            // Show success message
            showNotification('Video generated successfully!', 'success');
        }, 2000);
    });
}

// Enhanced Notification System with Apple-style animations
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    const bgColor = type === 'success' ? 'var(--accent-purple)' : 
                     type === 'error' ? '#ef4444' : 'var(--bg-card)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        max-width: 350px;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        backdrop-filter: blur(10px);
    `;
    notification.innerHTML = `<span style="font-size: 1.25rem;">${icon}</span><span>${message}</span>`;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Add enhanced CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Smooth cursor follow effect */
    .cursor-glow {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease-out;
        mix-blend-mode: screen;
    }
    
    /* Enhanced button hover states */
    .btn-generate,
    .btn-login,
    .btn-smart-expand {
        position: relative;
        overflow: hidden;
    }
    
    /* Magnetic effect for cards */
    .feature-card,
    .gallery-item {
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
`;
document.head.appendChild(style);

// Add magnetic cursor effect for interactive elements
let cursor = null;
if (window.innerWidth > 768) {
    cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        }
    });
    
    // Enhance hover effect
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .gallery-item, .control-select');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.transform = 'scale(1)';
        });
    });
}

// Enhanced Navbar on scroll with smooth transitions
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Enhanced Feature Card Interactions with smooth animations
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    // Add magnetic effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 10;
        const moveY = (y - centerY) / 10;
        
        card.style.transform = `translateY(-8px) scale(1.02) translate(${moveX}px, ${moveY}px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
    
    card.addEventListener('click', () => {
        const title = card.querySelector('.feature-title').textContent;
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
            showNotification(`Opening ${title}...`, 'info');
        }, 150);
    });
});

// Enhanced Gallery Item Interactions with smooth animations
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach((item, index) => {
    // Add random gradient backgrounds to gallery items
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    item.style.background = gradients[index % gradients.length];
    
    // Add magnetic effect
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 15;
        const moveY = (y - centerY) / 15;
        
        item.style.transform = `scale(1.08) translateY(-5px) translate(${moveX}px, ${moveY}px)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
    
    item.addEventListener('click', () => {
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
            showNotification('Opening video preview...', 'info');
        }, 150);
    });
});

// Simplified Intersection Observer - cleaner reveals
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Smooth unified scroll handler - no parallax, just clean transitions
let ticking = false;
let lastScrollY = 0;

function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionHeight = rect.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Check if section is in viewport
        if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
            section.classList.add('visible');
            section.classList.remove('scrolling');
        } else {
            section.classList.remove('visible');
        }
    });
    
    lastScrollY = scrollY;
}

// Throttled scroll handler
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Observe elements for animation - simplified
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .gallery-item');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    
    // Initialize sections as visible
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index === 0) {
            section.classList.add('visible');
        }
        observer.observe(section);
    });
    
    // Initial scroll check
    handleScroll();
});

// Add active state to current section in navigation
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Add active class styling
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-link.active {
        color: var(--accent-purple-light);
    }
`;
document.head.appendChild(navStyle);

// Video Upload Handler (if file input is added later)
function handleVideoUpload(file) {
    if (file && file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            showNotification('Video uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    } else {
        showNotification('Please select a valid video file', 'error');
    }
}
