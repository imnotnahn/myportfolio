document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginForm = document.getElementById('login-form');
    const submitLoginButton = document.getElementById('submit-login');
    const addProjectForm = document.getElementById('add-project-form');
    const submitProjectButton = document.getElementById('submit-project');
    const projectsContainer = document.getElementById('projects');
    const projectImage = document.getElementById('project-image');
    const imagePreview = document.getElementById('image-preview');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        addProjectForm.style.display = 'block';
    }
    
    projectImage.addEventListener('change', function() {
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
    
    loginButton.addEventListener('click', function() {
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    });
    
    submitLoginButton.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (typeof config !== 'undefined' && username === config.username && password === config.password) {
            localStorage.setItem('isLoggedIn', 'true');
            loginButton.style.display = 'none';
            logoutButton.style.display = 'block';
            loginForm.style.display = 'none';
            addProjectForm.style.display = 'block';
        } else {
            showNotification('Invalid credentials', 'error');
        }
    });
    
    logoutButton.addEventListener('click', function() {
        localStorage.setItem('isLoggedIn', 'false');
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        addProjectForm.style.display = 'none';
        showNotification('Logged out successfully', 'success');
    });
    
    submitProjectButton.addEventListener('click', function() {
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const link = document.getElementById('project-link').value;
        const imageFile = document.getElementById('project-image').files[0];
        
        if (!title || !description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                saveProject(title, description, link, e.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveProject(title, description, link, null);
        }
    });
    
    function saveProject(title, description, link, imageData) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const newProject = {
            id: Date.now(),
            title: title,
            description: description,
            link: link,
            image: imageData,
            date: new Date().toLocaleDateString()
        };
        
        projects.unshift(newProject); // Add to beginning of array
        localStorage.setItem('projects', JSON.stringify(projects));
        
        document.getElementById('project-title').value = '';
        document.getElementById('project-description').value = '';
        document.getElementById('project-link').value = '';
        document.getElementById('project-image').value = '';
        imagePreview.innerHTML = '';
        
        displayProjects();
        showNotification('Project added successfully', 'success');
    }
    
    function deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const updatedProjects = projects.filter(project => project.id !== id);
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            displayProjects();
            showNotification('Project deleted successfully', 'success');
        }
    }
    
    function displayProjects() {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projectsContainer.innerHTML = '';
        
        if (projects.length === 0) {
            projectsContainer.innerHTML = '<div class="empty-message"><i class="fas fa-briefcase"></i> No projects yet</div>';
            return;
        }
        
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            
            let imageHtml = '';
            if (project.image) {
                imageHtml = `<img src="${project.image}" alt="${project.title}" class="project-img">`;
            }
            
            let linkHtml = '';
            if (project.link) {
                linkHtml = `<a href="${project.link}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> View Project</a>`;
            }
            
            let deleteButton = '';
            if (isLoggedIn) {
                deleteButton = `<button class="delete-btn" data-id="${project.id}"><i class="fas fa-trash"></i></button>`;
            }
            
            projectElement.innerHTML = `
                ${deleteButton}
                ${imageHtml}
                <h2>${project.title}</h2>
                <div class="project-description">${project.description}</div>
                ${linkHtml}
                <div class="project-date"><i class="far fa-calendar-alt"></i> ${project.date}</div>
            `;
            
            projectsContainer.appendChild(projectElement);
        });
        
        if (isLoggedIn) {
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    deleteProject(id);
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
    
    displayProjects();
});