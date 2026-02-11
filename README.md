# Backend Team Website

A modern, responsive website for showcasing your backend team's services, technologies, and expertise.

## Features

- 🎨 Modern, clean design with smooth animations
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast and lightweight
- 🎯 Smooth scrolling navigation
- 🌈 Beautiful gradient hero section
- 💼 Service showcase
- 👥 Team member profiles
- 🛠️ Technology stack display
- 📧 Contact form

## Getting Started

### Prerequisites

No dependencies required! This is a pure HTML, CSS, and JavaScript website.

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser

That's it! No build process or package installation needed.

### Local Development

For a better development experience, you can use a local server:

#### Using Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js
```bash
npx http-server
```

#### Using PHP
```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Customization

### Update Team Information

Edit the team section in `index.html` (around line 200) to add your actual team members:

```html
<div class="team-member">
    <div class="member-avatar">
        <span class="avatar-icon">👨‍💻</span>
    </div>
    <h3 class="member-name">Your Name</h3>
    <p class="member-role">Your Role</p>
    <p class="member-bio">Your bio</p>
</div>
```

### Update Contact Information

Modify the contact section in `index.html` (around line 250) with your actual contact details:

```html
<div class="contact-item">
    <div class="contact-icon">📧</div>
    <div>
        <h3>Email</h3>
        <p>your-email@example.com</p>
    </div>
</div>
```

### Change Colors

Update the CSS variables in `styles.css` (at the top of the file) to match your brand:

```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --secondary-color: #8b5cf6;
    /* ... */
}
```

### Add Backend Integration

To connect the contact form to a backend, modify the form submission handler in `script.js`:

```javascript
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Message sent successfully!');
            contactForm.reset();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
```

## File Structure

```
backend-team-website/
├── index.html      # Main HTML file
├── styles.css      # All styles and responsive design
├── script.js       # Interactive functionality
└── README.md       # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Feel free to use this template for your team's website!

## Contributing

1. Customize the content to match your team
2. Update colors and branding
3. Add your team members and services
4. Connect the contact form to your backend API

---

Built with ❤️ for backend teams everywhere.
