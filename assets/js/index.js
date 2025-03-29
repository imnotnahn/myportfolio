document.addEventListener('DOMContentLoaded', function() {
    // Image slider functionality
    const slides = document.querySelectorAll('.slide');
    const controls = document.querySelectorAll('.slider-controls button');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        controls.forEach(control => control.classList.remove('active'));
        
        slides[index].classList.add('active');
        controls[index].classList.add('active');
        currentSlide = index;
    }

    controls.forEach(control => {
        control.addEventListener('click', function() {
            showSlide(parseInt(this.dataset.index));
        });
    });

    setInterval(function() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // Load blog posts
    const blogContainer = document.querySelector('.div8 .blog-post').parentNode;
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Clear existing placeholder posts
    blogContainer.innerHTML = '<h2>My blog posts</h2>';
    
    if (blogPosts.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'blog-post';
        emptyMessage.innerHTML = '<h3>Empty</h3><p>No blog posts yet</p>';
        blogContainer.appendChild(emptyMessage);
    } else {
        // Show up to 3 most recent posts
        const postsToShow = blogPosts.slice(0, 3);
        
        postsToShow.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                <div class="blog-date">${post.date}</div>
            `;
            blogContainer.appendChild(postElement);
        });
    }
    
    // Add view all button
    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = '/html/blog.html';
    viewAllBtn.className = 'view-all-btn';
    viewAllBtn.textContent = 'All Posts';
    blogContainer.appendChild(viewAllBtn);
    
    // Load projects
    const projectContainer = document.querySelector('.div7 .project-list');
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // Clear existing placeholder projects
    projectContainer.innerHTML = '';
    
    if (projects.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'project-item';
        emptyMessage.textContent = 'Empty: No projects yet';
        projectContainer.appendChild(emptyMessage);
    } else {
        // Show up to 3 most recent projects
        const projectsToShow = projects.slice(0, 3);
        
        projectsToShow.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.textContent = `Project: ${project.title}`;
            projectContainer.appendChild(projectElement);
        });
    }
});