document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginForm = document.getElementById('login-form');
    const submitLoginButton = document.getElementById('submit-login');
    const addPostForm = document.getElementById('add-post-form');
    const submitPostButton = document.getElementById('submit-post');
    const blogPostsContainer = document.getElementById('blog-posts');
    const postImage = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        addPostForm.style.display = 'block';
    }
    
    // Image preview
    postImage.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });
    
    // Login form toggle
    loginButton.addEventListener('click', function() {
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    });
    
    // Login submission
    submitLoginButton.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Using auth-config
        if (typeof config !== 'undefined' && username === config.username && password === config.password) {
            localStorage.setItem('isLoggedIn', 'true');
            loginButton.style.display = 'none';
            logoutButton.style.display = 'block';
            loginForm.style.display = 'none';
            addPostForm.style.display = 'block';
        } else {
            showNotification('Invalid credentials', 'error');
        }
    });
    
    // Logout
    logoutButton.addEventListener('click', function() {
        localStorage.setItem('isLoggedIn', 'false');
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        addPostForm.style.display = 'none';
        showNotification('Logged out successfully', 'success');
    });
    
    // Submit new post
    submitPostButton.addEventListener('click', function() {
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const imageFile = document.getElementById('post-image').files[0];
        
        if (!title || !content) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Handle image upload
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                savePost(title, content, e.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            savePost(title, content, null);
        }
    });
    
    // Save post to localStorage
    function savePost(title, content, imageData) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const newPost = {
            id: Date.now(),
            title: title,
            content: content,
            image: imageData,
            date: new Date().toLocaleDateString()
        };
        
        posts.unshift(newPost); // Add to beginning of array
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        // Clear form
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        document.getElementById('post-image').value = '';
        imagePreview.innerHTML = '';
        
        // Refresh post display
        displayPosts();
        showNotification('Post published successfully', 'success');
    }
    
    // Delete post
    function deletePost(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            const updatedPosts = posts.filter(post => post.id !== id);
            localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
            displayPosts();
            showNotification('Post deleted successfully', 'success');
        }
    }
    
    // Display posts
    function displayPosts() {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        blogPostsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            blogPostsContainer.innerHTML = '<div class="empty-message"><i class="fas fa-pen-fancy"></i> No blog posts yet</div>';
            return;
        }
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            
            let imageHtml = '';
            if (post.image) {
                imageHtml = `<img src="${post.image}" alt="${post.title}" class="blog-post-img">`;
            }
            
            let deleteButton = '';
            if (isLoggedIn) {
                deleteButton = `<button class="delete-btn" data-id="${post.id}"><i class="fas fa-trash"></i></button>`;
            }
            
            postElement.innerHTML = `
                ${deleteButton}
                ${imageHtml}
                <h2>${post.title}</h2>
                <div class="post-content">${post.content}</div>
                <div class="blog-date"><i class="far fa-calendar-alt"></i> ${post.date}</div>
            `;
            
            blogPostsContainer.appendChild(postElement);
        });
        
        // Add event listeners to delete buttons
        if (isLoggedIn) {
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    deletePost(id);
                });
            });
        }
    }
    
    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Initial display
    displayPosts();
});