// DOM Elements
const postsContainer = document.querySelector('.posts-container');
const replyButtons = document.querySelectorAll('.reply-btn');
const themeButton = document.querySelector('.setting-btn:nth-child(2)');
const navItems = document.querySelectorAll('.nav-item');

// Sample post data
const samplePosts = [
    {
        username: '@user1',
        content: 'Paano pumunta sa UP Diliman from Tondo?',
        featured: true
    },
    {
        username: '@user1',
        content: 'Paano pumunta sa UP Diliman from Tondo?',
        featured: true
    }
];

// Create post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
        <div class="post-header">
            <img src="user-icon.png" alt="User Icon" class="user-icon-small">
            <span class="username">${post.username}</span>
            ${post.featured ? '<span class="featured-badge">★</span>' : ''}
        </div>
        <div class="post-content">
            <p>${post.content}</p>
            ${post.image ? `
                <img src="${post.image}" alt="Post Image" class="post-image">
            ` : ''}
        </div>
        <button class="reply-btn">Reply</button>
    `;



    return postElement;
}

// Add initialization
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
    
    initializePosts();
    initializeReplyButtons();
    initializeNavigation();
    initializeProfileNavigation();
    initializePostCreation();
});

// Initialize posts
function initializePosts() {
    samplePosts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Reply functionality
function handleReplySubmit(e) {
    if (e.target.classList.contains('submit-reply')) {
        const replyForm = e.target.closest('.reply-form');
        const textarea = replyForm.querySelector('textarea');
        const post = replyForm.closest('.post');
        
        if (textarea.value.trim()) {
            const replyContent = document.createElement('div');
            replyContent.className = 'post-reply';
            replyContent.innerHTML = `
                <div class="post-header">
                    <img src="user-icon.png" alt="User Icon" class="user-icon-small">
                    <span class="username">@user1</span>
                </div>
                <div class="post-content">
                    <p>${textarea.value}</p>
                </div>
            `;
            
            post.insertBefore(replyContent, replyForm);
            replyForm.remove();
            
            const replyBtn = post.querySelector('.reply-btn');
            replyBtn.style.display = 'block';
        }
    }
}

function initializeReplyButtons() {
    // Remove any existing event listeners
    document.removeEventListener('click', handleReplySubmit);
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('reply-btn')) {
            // Remove any existing reply forms first
            const existingForms = document.querySelectorAll('.reply-form');
            existingForms.forEach(form => {
                const post = form.closest('.post');
                form.remove();
                const replyBtn = post.querySelector('.reply-btn');
                if (replyBtn) replyBtn.style.display = 'block';
            });

            const post = e.target.closest('.post');
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <textarea placeholder="Share your idea..."></textarea>
                <button class="submit-reply">Reply</button>
            `;
            post.appendChild(replyForm);
            e.target.style.display = 'none';
        }
    });
    
    // Add single event listener for reply submission
    document.addEventListener('click', handleReplySubmit);
}

// Theme toggle
let isDarkTheme = false;
function toggleTheme() {
    const root = document.documentElement;
    isDarkTheme = !isDarkTheme;
    if (isDarkTheme) {
        root.style.setProperty('--beige', '#2C2C2C');
        root.style.setProperty('--text-dark', '#FFFFFF');
        root.style.setProperty('--grey', '#1A1A1A');
        root.style.setProperty('--teal', '#4A4A4A');
        root.style.setProperty('--dark-teal', '#333333');
    } else {
        root.style.setProperty('--beige', '#FFF3E0');
        root.style.setProperty('--text-dark', '#002B23');
        root.style.setProperty('--grey', '#E0E0E0');
        root.style.setProperty('--teal', '#5CCFB1');
        root.style.setProperty('--dark-teal', '#004D40');
    }
}

// Navigation functionality
function initializeNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Handle navigation to Saan? Magkano? page
            if (item.textContent === 'Saan? Magkano?') {
                window.location.href = 'saan-magkano.html';
            }
        });
    });
}

// Profile navigation
function initializeProfileNavigation() {
    const profileElements = document.querySelectorAll('.user-info, .username');
    profileElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    });
}

// Post creation functionality
function initializePostCreation() {
    const addPostBtn = document.querySelector('.add-post-btn');
    const overlay = document.querySelector('.overlay');
    const popup = document.querySelector('.post-creation-popup');
    const cancelBtn = document.querySelector('.cancel-post');
    const submitBtn = document.querySelector('.submit-post');
    const textarea = popup.querySelector('textarea');
    const imageInput = popup.querySelector('#post-image');
    const imagePreview = popup.querySelector('.image-preview');
    const previewImage = popup.querySelector('#preview-image');
    const removeImageBtn = popup.querySelector('.remove-image');
    let selectedImage = null;

    function showPopup() {
        overlay.classList.add('active');
        popup.classList.add('active');
    }

    function hidePopup() {
        overlay.classList.remove('active');
        popup.classList.remove('active');
        textarea.value = '';
        removeImage();
    }

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                selectedImage = e.target.result;
                previewImage.src = selectedImage;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    function removeImage() {
        imageInput.value = '';
        selectedImage = null;
        previewImage.src = '';
        imagePreview.style.display = 'none';
    }

    function handlePostSubmit() {
        const content = textarea.value.trim();
        if (content) {
            const newPost = {
                username: '@user1',
                content: content,
                featured: false,
                image: selectedImage
            };
            const postElement = createPostElement(newPost);
            postsContainer.insertBefore(postElement, postsContainer.firstChild);
            hidePopup();
        }
    }

    addPostBtn.addEventListener('click', showPopup);
    cancelBtn.addEventListener('click', hidePopup);
    submitBtn.addEventListener('click', handlePostSubmit);
    overlay.addEventListener('click', hidePopup);
    imageInput.addEventListener('change', handleImageSelect);
    removeImageBtn.addEventListener('click', removeImage);
}

// Initialize application
function initializeApp() {
    initializePosts();
    initializeReplyButtons();
    initializeNavigation();
    initializeProfileNavigation();
    initializePostCreation();
    
    // Theme toggle event listener
    themeButton.addEventListener('click', toggleTheme);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

function setTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.style.setProperty('--beige', '#2C2C2C');
        root.style.setProperty('--text-dark', '#FFFFFF');
        root.style.setProperty('--grey', '#1A1A1A');
        root.style.setProperty('--teal', '#4A4A4A');
        root.style.setProperty('--dark-teal', '#333333');
        localStorage.setItem('theme', 'dark');
    } else if (theme === 'red') {
        root.style.setProperty('--beige', '#FFE6E6');
        root.style.setProperty('--text-dark', '#800000');
        root.style.setProperty('--grey', '#FFCCCC');
        root.style.setProperty('--teal', '#CC0000');
        root.style.setProperty('--dark-teal', '#800000');
        localStorage.setItem('theme', 'red');
    } else if (theme === 'light') {
        root.style.setProperty('--beige', '#FFF3E0');
        root.style.setProperty('--text-dark', '#002B23');
        root.style.setProperty('--grey', '#E0E0E0');
        root.style.setProperty('--teal', '#5CCFB1');
        root.style.setProperty('--dark-teal', '#004D40');
        localStorage.setItem('theme', 'light');
    }
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
});