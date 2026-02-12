// app.js - Complete JavaScript for Registration Form and Portfolio
// Contains: Form Validation, jQuery Operations, and Project Modal Logic

// ============================================
// PART 1: INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize form validation if on registration page
    if (document.getElementById('registrationForm')) {
        initializeFormValidation();
    }
    
    // Initialize project modal if on portfolio page
    if (document.getElementById('projectModal')) {
        initializeProjectModal();
    }
});

// ============================================
// PART 2: FORM VALIDATION LOGIC
// ============================================

function initializeFormValidation() {
    const form = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Add blur event listeners for validation (validates when user leaves field)
    usernameInput.addEventListener('blur', function() {
        validateField('username');
    });
    
    emailInput.addEventListener('blur', function() {
        validateField('email');
    });
    
    phoneInput.addEventListener('blur', function() {
        validateField('phone');
    });
    
    passwordInput.addEventListener('blur', function() {
        validateField('password');
    });
    
    confirmPasswordInput.addEventListener('blur', function() {
        validateField('confirmPassword');
    });
    
    // Real-time password requirements update (updates as user types)
    passwordInput.addEventListener('input', function() {
        updatePasswordRequirements();
    });
    
    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        handleFormSubmit();
    });
}

// --- VALIDATION FUNCTIONS ---

function validateUsername(username) {
    const errors = [];
    
    if (username.trim() === '') {
        errors.push('Username is required');
    } else if (username.length < 3) {
        errors.push('Username must be at least 3 characters');
    } else if (username.length > 20) {
        errors.push('Username cannot exceed 20 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function validateEmail(email) {
    const errors = [];
    // Email must have @ and proper domain format (2-3 letters before and after dot)
    const emailRegex = /^[^\s@]+@[a-zA-Z]{2,3}\.[a-zA-Z]{2,3}$/;
    
    if (email.trim() === '') {
        errors.push('Email is required');
    } else if (!email.includes('@')) {
        errors.push('Email must contain @ symbol');
    } else if (!emailRegex.test(email)) {
        errors.push('Email format is incorrect (e.g., user@example.com)');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function validatePhone(phone) {
    const errors = [];
    const phoneRegex = /^[0-9]{10}$/;
    
    if (phone.trim() === '') {
        errors.push('Phone number is required');
    } else if (!/^[0-9]+$/.test(phone)) {
        errors.push('Phone number must contain only digits');
    } else if (!phoneRegex.test(phone)) {
        errors.push('Phone number must be exactly 10 digits');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function validatePassword(password) {
    const errors = [];
    
    if (password.trim() === '') {
        errors.push('Password is required');
    } else {
        if (password.length < 7) {
            errors.push('Password must be at least 7 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one digit');
        }
        if (!/[$#@]/.test(password)) {
            errors.push('Password must contain at least one special character ($, #, @)');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function validateConfirmPassword(password, confirmPassword) {
    const errors = [];
    
    if (confirmPassword.trim() === '') {
        errors.push('Please confirm your password');
    } else if (password !== confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// --- PASSWORD REQUIREMENTS INDICATOR ---

function updatePasswordRequirements() {
    const password = document.getElementById('password').value;
    
    // Check each requirement
    const hasLength = password.length >= 7;
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[$#@]/.test(password);
    
    // Update each requirement indicator
    updateRequirement('req-length', hasLength);
    updateRequirement('req-uppercase', hasUppercase);
    updateRequirement('req-digit', hasDigit);
    updateRequirement('req-special', hasSpecial);
}

function updateRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);
    
    if (isValid) {
        element.classList.add('valid');
        element.classList.remove('invalid');
        // Change ✗ to ✓ using innerHTML (DOM manipulation)
        element.innerHTML = element.innerHTML.replace('✗', '✓');
    } else {
        element.classList.add('invalid');
        element.classList.remove('valid');
        // Change ✓ to ✗
        element.innerHTML = element.innerHTML.replace('✓', '✗');
    }
}

// --- VALIDATE INDIVIDUAL FIELD ---

function validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const value = input.value;
    let validation;
    
    // Call appropriate validation function based on field name
    switch(fieldName) {
        case 'username':
            validation = validateUsername(value);
            break;
        case 'email':
            validation = validateEmail(value);
            break;
        case 'phone':
            validation = validatePhone(value);
            break;
        case 'password':
            validation = validatePassword(value);
            break;
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            validation = validateConfirmPassword(password, value);
            break;
    }
    
    // Display appropriate state
    if (validation.isValid) {
        displaySuccess(input);
    } else {
        displayError(input, validation.errors);
    }
    
    return validation.isValid;
}

// --- DISPLAY ERROR MESSAGE ---

function displayError(inputElement, errors) {
    // Remove previous error message if exists (DOM manipulation)
    const existingError = inputElement.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class to input using classList
    inputElement.classList.add('input-error');
    inputElement.classList.remove('input-valid');
    
    // Create and display new error message using createElement and appendChild
    if (errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errors[0]; // Display first error
        inputElement.parentNode.appendChild(errorDiv);
    }
}

// --- DISPLAY SUCCESS STATE ---

function displaySuccess(inputElement) {
    // Remove previous error message
    const existingError = inputElement.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add success class
    inputElement.classList.remove('input-error');
    inputElement.classList.add('input-valid');
}

// --- FORM SUBMISSION HANDLER ---

function handleFormSubmit() {
    // Validate all fields
    const isUsernameValid = validateField('username');
    const isEmailValid = validateField('email');
    const isPhoneValid = validateField('phone');
    const isPasswordValid = validateField('password');
    const isConfirmValid = validateField('confirmPassword');
    
    // Check if entire form is valid
    const isFormValid = isUsernameValid && isEmailValid && isPhoneValid && 
                        isPasswordValid && isConfirmValid;
    
    if (isFormValid) {
        // Hide form, show success message using DOM manipulation
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Log success
        console.log('Form submitted successfully!');
        
        // Get form data (demonstrating data access)
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
        console.log('Form Data:', formData);
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.input-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ============================================
// PART 3: JQUERY OPERATIONS
// ============================================

$(document).ready(function() {
    
    // jQuery Example 1: CSS manipulation on focus
    $('input').focus(function() {
        $(this).css('box-shadow', '0 0 10px rgba(0, 210, 211, 0.3)');
    });
    
    $('input').blur(function() {
        $(this).css('box-shadow', 'none');
    });
    
    // jQuery Example 2: Change button text on submit
    $('#registrationForm').on('submit', function() {
        $('.btn-submit').text('Processing...');
    });
    
    // jQuery Example 3: Add/Remove classes
    $('.form-group input').on('input', function() {
        if ($(this).val().length > 0) {
            $(this).addClass('has-content');
        } else {
            $(this).removeClass('has-content');
        }
    });
    
    // jQuery Example 4: Attribute manipulation
    $('.btn-submit').hover(
        function() {
            $(this).attr('data-hover', 'true');
        },
        function() {
            $(this).removeAttr('data-hover');
        }
    );
    
    // jQuery Example 5: Get/Set values
    $('#registrationForm').on('submit', function(e) {
        e.preventDefault();
        // Demonstrate jQuery form serialization
        const formData = $(this).serialize();
        console.log('jQuery Serialized Data:', formData);
    });
});

// ============================================
// PART 4: PROJECT DATA AND MODAL LOGIC
// ============================================

// Project data array
const projects = [
    {
        id: 1,
        title: "E-Commerce App",
        shortDesc: "A full-featured shopping platform with cart functionality.",
        fullDesc: "A comprehensive e-commerce solution built with vanilla JavaScript featuring a responsive product catalog, shopping cart with real-time updates, user authentication, and local storage for persistent data. The application demonstrates advanced DOM manipulation and state management techniques.",
        technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage API"],
        features: [
            "Dynamic product catalog with search and filtering",
            "Shopping cart with add/remove/update quantity",
            "Responsive design for all devices",
            "User authentication and session management",
            "Order summary and checkout process"
        ],
        github: "https://github.com/manasvish/ecommerce-app",
        liveDemo: "https://manasvish.github.io/ecommerce-app"
    },
    {
        id: 2,
        title: "Finance Dashboard",
        shortDesc: "Data visualization dashboard for personal finance tracking.",
        fullDesc: "An interactive financial dashboard featuring dynamic charts and analytics built with Chart.js. Track expenses, visualize spending patterns, set budgets, and generate monthly reports. The dashboard provides real-time insights into your financial health with beautiful, interactive visualizations.",
        technologies: ["HTML5", "CSS3", "JavaScript", "Chart.js", "LocalStorage"],
        features: [
            "Real-time expense tracking and categorization",
            "Interactive charts showing spending patterns",
            "Budget creation and monitoring with alerts",
            "Monthly and yearly financial reports",
            "Export data to CSV for external analysis"
        ],
        github: "https://github.com/manasvish/finance-dashboard",
        liveDemo: "https://manasvish.github.io/finance-dashboard"
    },
    {
        id: 3,
        title: "Travel Blog",
        shortDesc: "A responsive blog layout for travel enthusiasts.",
        fullDesc: "A modern blog platform designed specifically for travel content creators. Features a clean, magazine-style layout with image galleries, social sharing capabilities, and advanced search functionality. Built with mobile-first approach using CSS Grid and Flexbox for optimal viewing on all devices.",
        technologies: ["HTML5", "CSS Grid", "Flexbox", "JavaScript", "Responsive Design"],
        features: [
            "Responsive grid-based layout",
            "Photo galleries with lightbox effect",
            "Social media sharing integration",
            "Advanced search and filtering",
            "Category and tag-based navigation",
            "Comment system for reader engagement"
        ],
        github: "https://github.com/manasvish/travel-blog",
        liveDemo: "https://manasvish.github.io/travel-blog"
    }
];

// Initialize project modal functionality
function initializeProjectModal() {
    
    // jQuery click handler for "View Details" links
    $('.view-details').click(function(e) {
        e.preventDefault();
        
        // Get project ID from parent card (getAttribute example)
        const projectId = $(this).closest('.card').data('project-id');
        
        // Open modal with this project
        openProjectModal(projectId);
    });
    
    // Close modal when X is clicked
    $('.close').click(function() {
        closeProjectModal();
    });
    
    // Close modal when clicking outside the modal content
    $(window).click(function(event) {
        if (event.target.id === 'projectModal') {
            closeProjectModal();
        }
    });
    
    // Close modal with ESC key
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            closeProjectModal();
        }
    });
}

// Open project modal with full details
function openProjectModal(projectId) {
    // Find the project in array
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    // Update modal content using jQuery (text manipulation)
    $('#modalTitle').text(project.title);
    $('#modalDescription').text(project.fullDesc);
    
    // Clear and add technologies (demonstrating empty() and append())
    $('#modalTechnologies').empty();
    project.technologies.forEach(function(tech) {
        $('#modalTechnologies').append(`<span>${tech}</span>`);
    });
    
    // Clear and add features
    $('#modalFeatures').empty();
    project.features.forEach(function(feature) {
        $('#modalFeatures').append(`<li>${feature}</li>`);
    });
    
    // Update links using jQuery attr() method
    $('#modalGithub').attr('href', project.github);
    $('#modalDemo').attr('href', project.liveDemo);
    
    // Show modal with fade effect
    $('#projectModal').fadeIn(300);
    
    // Prevent background scrolling using jQuery CSS
    $('body').css('overflow', 'hidden');
}

// Close project modal
function closeProjectModal() {
    // Hide modal with fade effect
    $('#projectModal').fadeOut(300);
    
    // Re-enable scrolling
    $('body').css('overflow', 'auto');
}

// ============================================
// PART 5: ADDITIONAL DOM MANIPULATION EXAMPLES
// ============================================

// Example: Modify attribute using DOM
function demoAttributeModification() {
    // Get element by ID
    const submitButton = document.getElementById('submitBtn');
    
    // Set attribute
    submitButton.setAttribute('disabled', 'true');
    
    // Get attribute
    const currentType = submitButton.getAttribute('type');
    
    // Remove attribute
    submitButton.removeAttribute('disabled');
    
    // Modify using property
    submitButton.disabled = false;
}

// Example: jQuery Ajax (for reference - commented out as no backend)
/*
function submitFormWithAjax() {
    $.ajax({
        url: 'submit-registration.php',
        type: 'POST',
        data: $('#registrationForm').serialize(),
        dataType: 'json',
        success: function(response) {
            console.log('Success:', response);
            $('#successMessage').fadeIn();
        },
        error: function(xhr, status, error) {
            console.log('Error:', error);
            alert('Submission failed. Please try again.');
        }
    });
}
*/

// Log when script loads
console.log('App.js loaded successfully!');
console.log('Form validation ready');
console.log('jQuery operations ready');
console.log('Project modal ready');