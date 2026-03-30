
<?php
// registration.php — Insert Student Record

require 'db.php';

$errors      = [];
$success_msg = "";
$form_data   = ['first_name'=>'','last_name'=>'','roll_no'=>'','phone'=>''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // --- Sanitize inputs ---
    $first_name      = trim(mysqli_real_escape_string($conn, $_POST['first_name']));
    $last_name       = trim(mysqli_real_escape_string($conn, $_POST['last_name']));
    $roll_no         = trim(mysqli_real_escape_string($conn, $_POST['roll_no']));
    $password        = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);
    $phone           = trim(mysqli_real_escape_string($conn, $_POST['phone']));

    // Keep form data to repopulate on error
    $form_data = compact('first_name','last_name','roll_no','phone');

    // --- PHP Server-side Validation ---
    if (empty($first_name) || !preg_match('/^[A-Za-z]{2,30}$/', $first_name))
        $errors[] = "First Name must be 2–30 letters only.";

    if (empty($last_name) || !preg_match('/^[A-Za-z]{2,30}$/', $last_name))
        $errors[] = "Last Name must be 2–30 letters only.";

    if (empty($roll_no) || !preg_match('/^[A-Za-z0-9]{3,15}$/', $roll_no))
        $errors[] = "Roll No must be 3–15 alphanumeric characters.";

    if (!preg_match('/^[0-9]{10}$/', $phone))
        $errors[] = "Phone number must be exactly 10 digits.";

    if (strlen($password) < 7 ||
        !preg_match('/[A-Z]/', $password) ||
        !preg_match('/\d/', $password) ||
        !preg_match('/[$#@]/', $password))
        $errors[] = "Password must be ≥7 chars and include uppercase, digit, and ($, #, @).";

    if ($password !== $confirm_password)
        $errors[] = "Passwords do not match.";

    // --- Check if Roll No already exists ---
    if (empty($errors)) {
        $check = mysqli_query($conn, "SELECT id FROM students WHERE roll_no = '$roll_no'");
        if (mysqli_num_rows($check) > 0)
            $errors[] = "Roll No '$roll_no' is already registered.";
    }

    // --- Insert if no errors ---
    if (empty($errors)) {
        $hashed_pw = hash('sha256', $password);
        $sql = "INSERT INTO students (first_name, last_name, roll_no, password, phone)
                VALUES ('$first_name','$last_name','$roll_no','$hashed_pw','$phone')";

        if (mysqli_query($conn, $sql)) {
            $success_msg = "Student <strong>$first_name $last_name</strong> (Roll No: $roll_no) registered successfully!";
            $form_data   = ['first_name'=>'','last_name'=>'','roll_no'=>'','phone'=>''];
        } else {
            $errors[] = "Database error: " . mysqli_error($conn);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #00d2d3;
            --bg-color: #121212;
            --bg-light: #1e1e1e;
            --text-color: #f0f0f0;
            --text-secondary: #aaaaaa;
            --font-main: 'Poppins', sans-serif;
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:var(--font-main); background:var(--bg-color); color:var(--text-color); line-height:1.6; }
        a { text-decoration:none; color:inherit; }
        ul { list-style:none; }
        .container { max-width:1100px; margin:0 auto; padding:0 20px; }

        /* Nav */
        header { background:rgba(18,18,18,0.95); padding:20px 0; position:sticky; top:0; z-index:1000; border-bottom:1px solid #333; }
        nav { display:flex; justify-content:space-between; align-items:center; }
        .logo { font-size:1.5rem; font-weight:700; }
        .logo span { color:var(--primary-color); }
        .nav-links { display:flex; gap:30px; align-items:center; }
        .nav-links a { font-weight:500; transition:color 0.3s; }
        .nav-links a:hover { color:var(--primary-color); }
        .btn-main { background:var(--primary-color); color:#121212 !important; padding:10px 20px; border-radius:5px; font-weight:600 !important; }

        /* Page layout */
        .registration-section { min-height:90vh; display:flex; align-items:center; padding:80px 20px; background:#0f0f0f; }
        .form-wrapper { max-width:580px; margin:0 auto; background:var(--bg-light); padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.3); width:100%; }
        .form-wrapper h2 { text-align:center; font-size:2rem; margin-bottom:10px; color:var(--primary-color); }
        .form-subtitle { text-align:center; color:var(--text-secondary); margin-bottom:30px; font-size:0.95rem; }

        /* Two-column row */
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; }

        /* Form groups */
        .form-group { margin-bottom:22px; }
        .form-group label { display:block; margin-bottom:8px; font-weight:500; }
        .form-group input {
            width:100%; padding:12px 15px;
            background:var(--bg-color); border:2px solid #333;
            border-radius:8px; color:var(--text-color);
            font-size:1rem; font-family:var(--font-main);
            transition:all 0.3s ease;
        }
        .form-group input:focus { outline:none; border-color:var(--primary-color); background:rgba(0,210,211,0.05); }
        .input-valid  { border-color:#00d2d3 !important; background:rgba(0,210,211,0.05) !important; }
        .input-error  { border-color:#ff4444 !important; background:rgba(255,68,68,0.05) !important; }

        /* Inline JS error messages */
        .error-message { display:block; color:#ff4444; font-size:0.82rem; margin-top:5px; }

        /* PHP alert blocks */
        .alert { padding:14px 18px; border-radius:8px; margin-bottom:22px; font-size:0.92rem; }
        .alert-danger  { background:rgba(255,68,68,0.1);  border:1px solid #ff4444; color:#ff6b6b; }
        .alert-success { background:rgba(0,210,211,0.1); border:1px solid #00d2d3; color:#00d2d3; }
        .alert ul { margin-top:6px; padding-left:18px; list-style:disc; }
        .alert ul li { margin:3px 0; }

        /* Password requirements */
        .password-requirements { margin-top:10px; padding:14px; background:var(--bg-color); border-radius:8px; border:1px solid #333; }
        .requirements-title { font-size:0.88rem; color:var(--text-secondary); margin-bottom:6px; }
        .password-requirements ul { padding:0; }
        .requirement { font-size:0.83rem; color:#aaa; margin:4px 0; transition:color 0.3s; }
        .requirement.valid   { color:#00d2d3; }
        .requirement.invalid { color:#ff4444; }

        /* Submit */
        .btn-submit { width:100%; padding:14px; background:var(--primary-color); color:#121212; border:none; border-radius:8px; font-size:1.05rem; font-weight:600; cursor:pointer; transition:all 0.3s; margin-top:8px; font-family:var(--font-main); }
        .btn-submit:hover { transform:translateY(-2px); box-shadow:0 5px 15px rgba(0,210,211,0.3); }

        /* Nav between pages */
        .page-nav { display:flex; gap:12px; justify-content:center; margin-top:24px; flex-wrap:wrap; }
        .page-nav a { padding:9px 20px; border-radius:6px; font-weight:600; font-size:0.88rem; transition:all 0.3s; border:2px solid var(--primary-color); color:var(--primary-color); }
        .page-nav a:hover { background:var(--primary-color); color:#121212; }

        footer { padding:30px; text-align:center; background:#000; color:#666; font-size:0.9rem; border-top:1px solid #222; }

        @media(max-width:768px) {
            .nav-links { display:none; }
            .form-row { grid-template-columns:1fr; }
            .form-wrapper { padding:25px; }
        }
    </style>
</head>
<body>

<header>
    <nav class="container">
        <div class="logo">Portfo<span>lio.</span></div>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="view_students.php">View Students</a></li>
            <li><a href="search_student.php">Search / Update</a></li>
            <li><a href="registration.php" class="btn-main">Register</a></li>
        </ul>
    </nav>
</header>

<section class="registration-section">
    <div class="form-wrapper">
        <h2>Student Registration</h2>
        <p class="form-subtitle">Fill in your details to register</p>

        <!-- PHP error/success messages -->
        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger">
                <strong>⚠ Please fix the following errors:</strong>
                <ul>
                    <?php foreach ($errors as $e): ?>
                        <li><?= htmlspecialchars($e) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php if ($success_msg): ?>
            <div class="alert alert-success">✓ <?= $success_msg ?></div>
        <?php endif; ?>

        <form id="registrationForm" method="POST" action="registration.php" novalidate>

            <div class="form-row">
                <!-- First Name -->
                <div class="form-group">
                    <label for="first_name">First Name *</label>
                    <input type="text" id="first_name" name="first_name"
                           placeholder="e.g. Manasvi"
                           value="<?= htmlspecialchars($form_data['first_name']) ?>">
                </div>
                <!-- Last Name -->
                <div class="form-group">
                    <label for="last_name">Last Name *</label>
                    <input type="text" id="last_name" name="last_name"
                           placeholder="e.g. Shelke"
                           value="<?= htmlspecialchars($form_data['last_name']) ?>">
                </div>
            </div>

            <div class="form-row">
                <!-- Roll No -->
                <div class="form-group">
                    <label for="roll_no">Roll No / ID *</label>
                    <input type="text" id="roll_no" name="roll_no"
                           placeholder="e.g. CS2025001"
                           value="<?= htmlspecialchars($form_data['roll_no']) ?>">
                </div>
                <!-- Phone -->
                <div class="form-group">
                    <label for="phone">Contact Number *</label>
                    <input type="tel" id="phone" name="phone"
                           placeholder="10-digit number"
                           value="<?= htmlspecialchars($form_data['phone']) ?>">
                </div>
            </div>

            <!-- Password -->
            <div class="form-group">
                <label for="password">Password *</label>
                <input type="password" id="password" name="password" placeholder="Enter password">
                <div class="password-requirements">
                    <p class="requirements-title">Password must contain:</p>
                    <ul>
                        <li id="req-length"    class="requirement">✗ At least 7 characters</li>
                        <li id="req-uppercase" class="requirement">✗ One uppercase letter</li>
                        <li id="req-digit"     class="requirement">✗ One digit (0–9)</li>
                        <li id="req-special"   class="requirement">✗ One special character ($, #, @)</li>
                    </ul>
                </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
                <label for="confirm_password">Confirm Password *</label>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="Re-enter password">
            </div>

            <button type="submit" class="btn-submit" id="submitBtn">Register Student</button>
        </form>

        <div class="page-nav">
            <a href="view_students.php">📋 View All Students</a>
            <a href="search_student.php">🔍 Search / Update / Delete</a>
        </div>
    </div>
</section>

<footer><p>&copy; 2024 Manasvi Shelke. All Rights Reserved.</p></footer>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
// =============================================
//  CLIENT-SIDE FORM VALIDATION  (JavaScript)
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    const fields = ['first_name','last_name','roll_no','phone','password','confirm_password'];

    // Blur validation for each field
    fields.forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('blur', function() { validateField(id); });
    });

    // Live password requirements
    document.getElementById('password').addEventListener('input', updatePasswordRequirements);

    // Form submit
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        let allValid = true;
        fields.forEach(function(id) { if (!validateField(id)) allValid = false; });
        if (!allValid) {
            e.preventDefault();
            const firstErr = document.querySelector('.input-error');
            if (firstErr) firstErr.scrollIntoView({ behavior:'smooth', block:'center' });
        }
    });
});

function validateField(fieldName) {
    const input = document.getElementById(fieldName);
    if (!input) return true;
    let result;
    switch (fieldName) {
        case 'first_name':
        case 'last_name':
            result = validateName(input.value, fieldName === 'first_name' ? 'First Name' : 'Last Name');
            break;
        case 'roll_no':
            result = validateRollNo(input.value);
            break;
        case 'phone':
            result = validatePhone(input.value);
            break;
        case 'password':
            result = validatePassword(input.value);
            break;
        case 'confirm_password':
            result = validateConfirm(document.getElementById('password').value, input.value);
            break;
        default: result = { isValid: true, errors: [] };
    }
    result.isValid ? displaySuccess(input) : displayError(input, result.errors);
    return result.isValid;
}

function validateName(val, label) {
    if (!val.trim()) return { isValid:false, errors:[label + ' is required.'] };
    if (!/^[A-Za-z]{2,30}$/.test(val)) return { isValid:false, errors:[label + ' must be 2–30 letters only.'] };
    return { isValid:true, errors:[] };
}
function validateRollNo(val) {
    if (!val.trim()) return { isValid:false, errors:['Roll No is required.'] };
    if (!/^[A-Za-z0-9]{3,15}$/.test(val)) return { isValid:false, errors:['Roll No: 3–15 alphanumeric characters.'] };
    return { isValid:true, errors:[] };
}
function validatePhone(val) {
    if (!val.trim()) return { isValid:false, errors:['Phone number is required.'] };
    if (!/^[0-9]{10}$/.test(val)) return { isValid:false, errors:['Phone must be exactly 10 digits.'] };
    return { isValid:true, errors:[] };
}
function validatePassword(val) {
    const errs = [];
    if (!val) { errs.push('Password is required.'); return { isValid:false, errors:errs }; }
    if (val.length < 7)          errs.push('Minimum 7 characters.');
    if (!/[A-Z]/.test(val))      errs.push('At least one uppercase letter.');
    if (!/\d/.test(val))         errs.push('At least one digit.');
    if (!/[$#@]/.test(val))      errs.push('At least one special character ($, #, @).');
    return { isValid: errs.length === 0, errors: errs };
}
function validateConfirm(pw, cpw) {
    if (!cpw.trim()) return { isValid:false, errors:['Please confirm your password.'] };
    if (pw !== cpw)  return { isValid:false, errors:['Passwords do not match.'] };
    return { isValid:true, errors:[] };
}

function updatePasswordRequirements() {
    const pw = document.getElementById('password').value;
    setReq('req-length',    pw.length >= 7);
    setReq('req-uppercase', /[A-Z]/.test(pw));
    setReq('req-digit',     /\d/.test(pw));
    setReq('req-special',   /[$#@]/.test(pw));
}
function setReq(id, ok) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'requirement ' + (ok ? 'valid' : 'invalid');
    el.innerHTML = el.innerHTML.replace(/[✓✗]/, ok ? '✓' : '✗');
}

function displayError(el, errs) {
    const existing = el.parentNode.querySelector('.error-message');
    if (existing) existing.remove();
    el.classList.add('input-error'); el.classList.remove('input-valid');
    if (errs.length > 0) {
        const d = document.createElement('div');
        d.className = 'error-message';
        d.textContent = errs[0];
        el.parentNode.appendChild(d);
    }
}
function displaySuccess(el) {
    const existing = el.parentNode.querySelector('.error-message');
    if (existing) existing.remove();
    el.classList.remove('input-error'); el.classList.add('input-valid');
}

// jQuery enhancements (matching original app.js style)
$(document).ready(function() {
    $('input').focus(function() { $(this).css('box-shadow','0 0 10px rgba(0,210,211,0.3)'); });
    $('input').blur(function()  { $(this).css('box-shadow','none'); });
    $('#registrationForm').on('submit', function() { $('.btn-submit').text('Registering...'); });
    $('.form-group input').on('input', function() {
        $(this).val().length > 0 ? $(this).addClass('has-content') : $(this).removeClass('has-content');
    });
});
</script>
</body>
</html>