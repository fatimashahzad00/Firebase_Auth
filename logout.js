import { auth, onAuthStateChanged, signOut } from './firebaseapp.js';

const logoutButton = document.getElementById('logoutButton');
const accountLink = document.getElementById('accountLink');
const blogPostsSection = document.getElementById('blogPosts');

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        if (logoutButton) {
            logoutButton.style.display = 'block';
        }
        if (accountLink) {
            accountLink.style.display = 'block';
        }
        displayBlogPosts(); // Show blog posts when user is logged in
    } else {
        // No user is signed in
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
        if (accountLink) {
            accountLink.style.display = 'none';
        }
        hideBlogPosts(); // Hide blog posts when user is logged out
    }
});

// Function to display blog posts
function displayBlogPosts() {
    // Clear existing posts
    blogPostsSection.innerHTML = '';

    // Fetch blog posts from Firebase or your backend and display them
    // This is a placeholder implementation
    const posts = [
        { title: 'First Blog Post', content: 'This is the content of the first blog post.' },
        { title: 'Second Blog Post', content: 'This is the content of the second blog post.' }
    ];

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
        `;
        blogPostsSection.appendChild(postElement);
    });

    blogPostsSection.style.display = 'block'; // Ensure blog posts are visible
}

// Function to hide blog posts
function hideBlogPosts() {
    if (blogPostsSection) {
        blogPostsSection.style.display = 'none'; // Hide blog posts
    }
}

// Logout function
logoutButton.addEventListener('click', function() {
    signOut(auth).then(function() {
        // Sign-out successful
        hideBlogPosts(); // Hide blog posts on logout
        window.location.href = 'index.html'; // Redirect to index or login page
    }).catch(function(error) {
        // An error happened
        console.error('Logout Error:', error);
    });
});