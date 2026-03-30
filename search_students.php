<?php
// search_student.php — Search by Roll No, then Update or Delete

require 'db.php';

$search_result = null;
$search_roll   = "";
$update_msg    = "";
$errors        = [];

// ── Pre-fill roll from view_students "Edit" button link ──
if (isset($_GET['roll']) && empty($_POST)) {
    $search_roll = mysqli_real_escape_string($conn, $_GET['roll']);
    $q = mysqli_query($conn, "SELECT * FROM students WHERE roll_no = '$search_roll'");
    if (mysqli_num_rows($q) > 0) {
        $search_result = mysqli_fetch_assoc($q);
    } else {
        $errors[] = "No student found with Roll No: $search_roll";
    }
}

// ── SEARCH action ──
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'search') {
    $search_roll = trim(mysqli_real_escape_string($conn, $_POST['search_roll']));
    if (empty($search_roll)) {
        $errors[] = "Please enter a Roll No to search.";
    } else {
        $q = mysqli_query($conn, "SELECT * FROM students WHERE roll_no = '$search_roll'");
        if (mysqli_num_rows($q) > 0) {
            $search_result = mysqli_fetch_assoc($q);
        } else {
            $errors[] = "No student found with Roll No: <strong>$search_roll</strong>";
        }
    }
}

// ── UPDATE action ──
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update') {
    $roll      = trim(mysqli_real_escape_string($conn, $_POST['roll_no']));
    $first     = trim(mysqli_real_escape_string($conn, $_POST['first_name']));
    $last      = trim(mysqli_real_escape_string($conn, $_POST['last_name']));
    $phone     = trim(mysqli_real_escape_string($conn, $_POST['phone']));
    $password  = trim($_POST['password']);
    $confirm   = trim($_POST['confirm_password']);

    // Validation
    if (!preg_match('/^[A-Za-z]{2,30}$/', $first))  $errors[] = "First Name must be 2–30 letters only.";
    if (!preg_match('/^[A-Za-z]{2,30}$/', $last))   $errors[] = "Last Name must be 2–30 letters only.";
    if (!preg_match('/^[0-9]{10}$/', $phone))        $errors[] = "Phone must be exactly 10 digits.";

    // Password update is optional — only validate if filled
    $update_password = false;
    if (!empty($password)) {
        if (strlen($password) < 7 || !preg_match('/[A-Z]/', $password) ||
            !preg_match('/\d/', $password) || !preg_match('/[$#@]/', $password))
            $errors[] = "Password must be ≥7 chars with uppercase, digit, and ($, #, @).";
        if ($password !== $confirm)
            $errors[] = "Passwords do not match.";
        if (empty($errors)) $update_password = true;
    }

    if (empty($errors)) {
        if ($update_password) {
            $hashed = hash('sha256', $password);
            $sql = "UPDATE students SET first_name='$first', last_name='$last', phone='$phone', password='$hashed' WHERE roll_no='$roll'";
        } else {
            $sql = "UPDATE students SET first_name='$first', last_name='$last', phone='$phone' WHERE roll_no='$roll'";
        }

        if (mysqli_query($conn, $sql)) {
            $update_msg = "success|Student record for Roll No <strong>$roll</strong> updated successfully!";
            // Reload updated record
            $q2 = mysqli_query($conn, "SELECT * FROM students WHERE roll_no = '$roll'");
            $search_result = mysqli_fetch_assoc($q2);
            $search_roll   = $roll;
        } else {
            $update_msg = "error|Update failed: " . mysqli_error($conn);
        }
    } else {
        // Repopulate for correction
        $search_roll   = $roll;
        $search_result = ['first_name'=>$first,'last_name'=>$last,'roll_no'=>$roll,'phone'=>$phone,'password'=>''];
    }
}

// ── DELETE action ──
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $roll = trim(mysqli_real_escape_string($conn, $_POST['roll_no']));
    $res  = mysqli_query($conn, "DELETE FROM students WHERE roll_no = '$roll'");
    if ($res) {
        header("Location: view_students.php?deleted=" . urlencode($roll));
        exit;
    } else {
        $update_msg = "error|Delete failed: " . mysqli_error($conn);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search / Update / Delete Student</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary-color:#00d2d3; --bg-color:#121212; --bg-light:#1e1e1e; --text-color:#f0f0f0; --text-secondary:#aaaaaa; }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Poppins',sans-serif; background:var(--bg-color); color:var(--text-color); line-height:1.6; }
        a { text-decoration:none; color:inherit; }
        ul { list-style:none; }
        .container { max-width:1100px; margin:0 auto; padding:0 20px; }

        header { background:rgba(18,18,18,0.95); padding:20px 0; position:sticky; top:0; z-index:1000; border-bottom:1px solid #333; }
        nav { display:flex; justify-content:space-between; align-items:center; }
        .logo { font-size:1.5rem; font-weight:700; }
        .logo span { color:var(--primary-color); }
        .nav-links { display:flex; gap:25px; align-items:center; }
        .nav-links a { font-weight:500; transition:color 0.3s; }
        .nav-links a:hover { color:var(--primary-color); }
        .btn-main { background:var(--primary-color); color:#121212 !important; padding:10px 20px; border-radius:5px; font-weight:600 !important; }

        .page-section { padding:60px 0; min-height:85vh; }
        .page-section h2 { font-size:2rem; color:var(--primary-color); margin-bottom:8px; }
        .page-section .subtitle { color:var(--text-secondary); font-size:0.93rem; margin-bottom:35px; }

        /* Search box */
        .search-box { background:var(--bg-light); padding:30px; border-radius:12px; margin-bottom:30px; border:1px solid #2a2a2a; }
        .search-box h3 { margin-bottom:18px; font-size:1.1rem; color:var(--text-color); }
        .search-row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .search-row input { flex:1; min-width:220px; padding:12px 16px; background:var(--bg-color); border:2px solid #333; border-radius:8px; color:var(--text-color); font-family:'Poppins',sans-serif; font-size:1rem; transition:border-color 0.3s; }
        .search-row input:focus { outline:none; border-color:var(--primary-color); }
        .btn-search { padding:12px 28px; background:var(--primary-color); color:#121212; border:none; border-radius:8px; font-weight:600; font-size:1rem; cursor:pointer; font-family:'Poppins',sans-serif; transition:all 0.3s; white-space:nowrap; }
        .btn-search:hover { opacity:0.85; transform:translateY(-1px); }

        /* Alerts */
        .alert { padding:13px 18px; border-radius:8px; margin-bottom:22px; font-size:0.92rem; }
        .alert-danger  { background:rgba(255,68,68,0.1);  border:1px solid #ff4444; color:#ff6b6b; }
        .alert-success { background:rgba(0,210,211,0.1); border:1px solid #00d2d3; color:#00d2d3; }
        .alert ul { margin-top:6px; padding-left:18px; list-style:disc; }

        /* Edit form */
        .edit-card { background:var(--bg-light); border-radius:12px; padding:35px; border:1px solid #2a2a2a; }
        .edit-card h3 { font-size:1.3rem; color:var(--primary-color); margin-bottom:5px; }
        .edit-card .found-badge { font-size:0.85rem; color:var(--text-secondary); margin-bottom:25px; display:block; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .form-group { margin-bottom:22px; }
        .form-group label { display:block; margin-bottom:8px; font-weight:500; font-size:0.95rem; }
        .form-group input { width:100%; padding:12px 15px; background:var(--bg-color); border:2px solid #333; border-radius:8px; color:var(--text-color); font-size:1rem; font-family:'Poppins',sans-serif; transition:all 0.3s; }
        .form-group input:focus { outline:none; border-color:var(--primary-color); background:rgba(0,210,211,0.05); }
        .form-group input[readonly] { cursor:not-allowed; opacity:0.5; }
        .input-valid { border-color:#00d2d3 !important; }
        .input-error { border-color:#ff4444 !important; }
        .error-message { color:#ff4444; font-size:0.82rem; margin-top:5px; display:block; }
        .field-note { color:var(--text-secondary); font-size:0.8rem; margin-top:4px; }

        /* Password section */
        .pw-section { border-top:1px solid #2a2a2a; padding-top:22px; margin-top:5px; }
        .pw-section h4 { font-size:0.95rem; color:var(--text-secondary); margin-bottom:15px; }
        .password-requirements { margin-top:10px; padding:13px; background:var(--bg-color); border-radius:8px; border:1px solid #333; }
        .requirements-title { font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px; }
        .password-requirements ul { padding:0; }
        .requirement { font-size:0.82rem; color:#aaa; margin:3px 0; transition:color 0.3s; }
        .requirement.valid   { color:#00d2d3; }
        .requirement.invalid { color:#ff4444; }

        /* Buttons row */
        .action-buttons { display:flex; gap:12px; margin-top:10px; flex-wrap:wrap; }
        .btn-update { padding:12px 30px; background:var(--primary-color); color:#121212; border:none; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; font-family:'Poppins',sans-serif; transition:all 0.3s; }
        .btn-update:hover { transform:translateY(-2px); box-shadow:0 5px 15px rgba(0,210,211,0.3); }
        .btn-delete-rec { padding:12px 24px; background:rgba(255,68,68,0.12); color:#ff4444; border:2px solid #ff4444; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; font-family:'Poppins',sans-serif; transition:all 0.3s; }
        .btn-delete-rec:hover { background:#ff4444; color:#fff; }
        .btn-cancel { padding:12px 22px; border:2px solid #444; color:var(--text-secondary); border-radius:8px; font-size:0.95rem; font-weight:500; transition:all 0.3s; }
        .btn-cancel:hover { border-color:var(--primary-color); color:var(--primary-color); }

        footer { padding:30px; text-align:center; background:#000; color:#666; font-size:0.9rem; border-top:1px solid #222; }
        @media(max-width:768px){ .nav-links{display:none;} .form-row{grid-template-columns:1fr;} .edit-card{padding:22px;} }
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

<section class="page-section">
    <div class="container">
        <h2>🔍 Search / Update / Delete</h2>
        <p class="subtitle">Search a student by Roll No, then update their details or delete their record.</p>

        <!-- Search Form -->
        <div class="search-box">
            <h3>Search by Roll No / ID</h3>
            <form method="POST" action="search_student.php">
                <input type="hidden" name="action" value="search">
                <div class="search-row">
                    <input type="text" name="search_roll"
                           placeholder="Enter Roll No (e.g. CS2025001)"
                           value="<?= htmlspecialchars($search_roll) ?>" required>
                    <button type="submit" class="btn-search">Search</button>
                </div>
            </form>
        </div>

        <!-- PHP errors -->
        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger">
                <strong>⚠ Error:</strong>
                <ul><?php foreach ($errors as $e): ?><li><?= $e ?></li><?php endforeach; ?></ul>
            </div>
        <?php endif; ?>

        <!-- Update / delete feedback -->
        <?php if ($update_msg): 
            [$type, $msg] = explode('|', $update_msg, 2);
        ?>
            <div class="alert alert-<?= $type === 'success' ? 'success' : 'danger' ?>"><?= $msg ?></div>
        <?php endif; ?>

        <!-- Edit form (shown only when a student is found) -->
        <?php if ($search_result): ?>
        <div class="edit-card">
            <h3>✏ Edit Student Record</h3>
            <span class="found-badge">Editing record for Roll No: <strong style="color:var(--primary-color)"><?= htmlspecialchars($search_result['roll_no']) ?></strong></span>

            <form id="updateForm" method="POST" action="search_student.php" novalidate>
                <input type="hidden" name="action"  value="update">
                <input type="hidden" name="roll_no" value="<?= htmlspecialchars($search_result['roll_no']) ?>">

                <div class="form-row">
                    <div class="form-group">
                        <label>First Name *</label>
                        <input type="text" id="u_first" name="first_name"
                               value="<?= htmlspecialchars($search_result['first_name']) ?>">
                    </div>
                    <div class="form-group">
                        <label>Last Name *</label>
                        <input type="text" id="u_last" name="last_name"
                               value="<?= htmlspecialchars($search_result['last_name']) ?>">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Roll No / ID</label>
                        <input type="text" value="<?= htmlspecialchars($search_result['roll_no']) ?>" readonly>
                        <span class="field-note">Roll No cannot be changed.</span>
                    </div>
                    <div class="form-group">
                        <label>Contact Number *</label>
                        <input type="tel" id="u_phone" name="phone"
                               value="<?= htmlspecialchars($search_result['phone']) ?>">
                    </div>
                </div>

                <!-- Optional password change -->
                <div class="pw-section">
                    <h4>🔒 Change Password <span style="font-weight:400;">(optional — leave blank to keep current)</span></h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" id="u_password" name="password" placeholder="New password">
                            <div class="password-requirements" id="pwReqs" style="display:none;">
                                <p class="requirements-title">Password must contain:</p>
                                <ul>
                                    <li id="u-req-length"    class="requirement">✗ At least 7 characters</li>
                                    <li id="u-req-uppercase" class="requirement">✗ One uppercase letter</li>
                                    <li id="u-req-digit"     class="requirement">✗ One digit</li>
                                    <li id="u-req-special"   class="requirement">✗ One special character ($, #, @)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" id="u_confirm" name="confirm_password" placeholder="Re-enter new password">
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn-update">💾 Save Changes</button>
                    <a href="view_students.php" class="btn-cancel">Cancel</a>
                </div>
            </form>

            <!-- Separate delete form -->
            <form method="POST" action="search_student.php" id="deleteRecForm" style="display:inline;">
                <input type="hidden" name="action"  value="delete">
                <input type="hidden" name="roll_no" value="<?= htmlspecialchars($search_result['roll_no']) ?>">
                <div style="margin-top:15px; border-top:1px solid #2a2a2a; padding-top:18px;">
                    <button type="button" class="btn-delete-rec"
                        onclick="confirmAndDelete('<?= htmlspecialchars($search_result['roll_no']) ?>', '<?= htmlspecialchars($search_result['first_name'].' '.$search_result['last_name']) ?>')">
                        🗑 Delete This Student
                    </button>
                </div>
            </form>
        </div>
        <?php endif; ?>

    </div>
</section>

<footer><p>&copy; 2024 Manasvi Shelke. All Rights Reserved.</p></footer>

<script>
// ── Update form validation ──
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('updateForm');
    if (!form) return;

    ['u_first','u_last','u_phone','u_password','u_confirm'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('blur', function() { validateUpdateField(id); });
    });

    // Show/hide pw requirements
    document.getElementById('u_password').addEventListener('input', function() {
        const box = document.getElementById('pwReqs');
        box.style.display = this.value ? 'block' : 'none';
        updatePwReqs(this.value);
    });

    form.addEventListener('submit', function(e) {
        let valid = true;
        ['u_first','u_last','u_phone'].forEach(function(id) {
            if (!validateUpdateField(id)) valid = false;
        });
        const pw = document.getElementById('u_password').value;
        if (pw) {
            if (!validateUpdateField('u_password'))  valid = false;
            if (!validateUpdateField('u_confirm'))   valid = false;
        }
        if (!valid) {
            e.preventDefault();
            const firstErr = document.querySelector('.input-error');
            if (firstErr) firstErr.scrollIntoView({ behavior:'smooth', block:'center' });
        }
    });
});

function validateUpdateField(id) {
    const el = document.getElementById(id);
    if (!el) return true;
    let ok = true, msg = '';
    switch(id) {
        case 'u_first':
        case 'u_last':
            if (!el.value.trim() || !/^[A-Za-z]{2,30}$/.test(el.value))
                { ok=false; msg='Must be 2–30 letters only.'; } break;
        case 'u_phone':
            if (!/^[0-9]{10}$/.test(el.value.trim()))
                { ok=false; msg='Must be exactly 10 digits.'; } break;
        case 'u_password':
            if (el.value && (el.value.length < 7 || !/[A-Z]/.test(el.value) || !/\d/.test(el.value) || !/[$#@]/.test(el.value)))
                { ok=false; msg='Does not meet password requirements.'; } break;
        case 'u_confirm':
            const pw = document.getElementById('u_password').value;
            if (pw && el.value !== pw) { ok=false; msg='Passwords do not match.'; } break;
    }
    const existing = el.parentNode.querySelector('.error-message');
    if (existing) existing.remove();
    if (!ok) {
        el.classList.add('input-error'); el.classList.remove('input-valid');
        const d = document.createElement('div');
        d.className='error-message'; d.textContent=msg;
        el.parentNode.appendChild(d);
    } else {
        el.classList.remove('input-error'); el.classList.add('input-valid');
    }
    return ok;
}

function updatePwReqs(pw) {
    setReq('u-req-length',    pw.length >= 7);
    setReq('u-req-uppercase', /[A-Z]/.test(pw));
    setReq('u-req-digit',     /\d/.test(pw));
    setReq('u-req-special',   /[$#@]/.test(pw));
}
function setReq(id, ok) {
    const el = document.getElementById(id); if (!el) return;
    el.className = 'requirement ' + (ok ? 'valid':'invalid');
    el.innerHTML = el.innerHTML.replace(/[✓✗]/, ok ? '✓':'✗');
}

function confirmAndDelete(roll, name) {
    if (confirm('⚠ Delete student:\n\n' + name + ' (' + roll + ')?\n\nThis action cannot be undone.')) {
        document.getElementById('deleteRecForm').submit();
    }
}
</script>
</body>
</html>