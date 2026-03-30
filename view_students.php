<?php
// view_students.php — Display all students in tabular format

require 'db.php';

$delete_msg = "";

// Handle delete via GET (from table action button)
if (isset($_GET['delete_roll'])) {
    $roll = mysqli_real_escape_string($conn, $_GET['delete_roll']);
    $result = mysqli_query($conn, "DELETE FROM students WHERE roll_no = '$roll'");
    $delete_msg = $result
        ? "success|Student with Roll No <strong>$roll</strong> deleted successfully."
        : "error|Delete failed: " . mysqli_error($conn);
}

// Fetch all students
$students = mysqli_query($conn, "SELECT * FROM students ORDER BY id DESC");
$total    = mysqli_num_rows($students);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Students</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary-color:#00d2d3; --bg-color:#121212; --bg-light:#1e1e1e; --text-color:#f0f0f0; --text-secondary:#aaaaaa; }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Poppins',sans-serif; background:var(--bg-color); color:var(--text-color); line-height:1.6; }
        a { text-decoration:none; color:inherit; }
        ul { list-style:none; }
        .container { max-width:1200px; margin:0 auto; padding:0 20px; }

        header { background:rgba(18,18,18,0.95); padding:20px 0; position:sticky; top:0; z-index:1000; border-bottom:1px solid #333; }
        nav { display:flex; justify-content:space-between; align-items:center; }
        .logo { font-size:1.5rem; font-weight:700; }
        .logo span { color:var(--primary-color); }
        .nav-links { display:flex; gap:25px; align-items:center; }
        .nav-links a { font-weight:500; transition:color 0.3s; }
        .nav-links a:hover { color:var(--primary-color); }
        .btn-main { background:var(--primary-color); color:#121212 !important; padding:10px 20px; border-radius:5px; font-weight:600 !important; }

        /* Page content */
        .page-section { padding:60px 0; min-height:85vh; }
        .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; flex-wrap:wrap; gap:15px; }
        .page-header h2 { font-size:2rem; color:var(--primary-color); }
        .badge { background:rgba(0,210,211,0.15); color:var(--primary-color); border:1px solid var(--primary-color); padding:5px 14px; border-radius:20px; font-size:0.88rem; }

        /* Alert */
        .alert { padding:12px 18px; border-radius:8px; margin-bottom:22px; font-size:0.92rem; }
        .alert-success { background:rgba(0,210,211,0.1); border:1px solid #00d2d3; color:#00d2d3; }
        .alert-danger  { background:rgba(255,68,68,0.1);  border:1px solid #ff4444; color:#ff6b6b; }

        /* Search bar */
        .search-bar { margin-bottom:20px; }
        .search-bar input { width:100%; max-width:400px; padding:10px 16px; background:var(--bg-light); border:2px solid #333; border-radius:8px; color:var(--text-color); font-family:'Poppins',sans-serif; font-size:0.95rem; transition:border-color 0.3s; }
        .search-bar input:focus { outline:none; border-color:var(--primary-color); }
        .search-bar input::placeholder { color:#555; }

        /* Table */
        .table-wrap { overflow-x:auto; border-radius:10px; border:1px solid #2a2a2a; }
        table { width:100%; border-collapse:collapse; font-size:0.92rem; }
        thead { background:var(--bg-light); }
        thead th { padding:14px 18px; text-align:left; color:var(--primary-color); font-weight:600; border-bottom:2px solid #2a2a2a; white-space:nowrap; }
        tbody tr { border-bottom:1px solid #222; transition:background 0.2s; }
        tbody tr:hover { background:rgba(0,210,211,0.04); }
        tbody td { padding:13px 18px; color:var(--text-color); vertical-align:middle; }
        .roll-badge { background:rgba(0,210,211,0.15); color:var(--primary-color); padding:3px 10px; border-radius:12px; font-weight:600; font-size:0.85rem; }

        /* Action buttons */
        .btn-edit, .btn-del { padding:6px 14px; border-radius:5px; font-size:0.82rem; font-weight:600; cursor:pointer; border:none; font-family:'Poppins',sans-serif; transition:all 0.2s; }
        .btn-edit { background:rgba(0,210,211,0.15); color:var(--primary-color); border:1px solid var(--primary-color); }
        .btn-edit:hover { background:var(--primary-color); color:#121212; }
        .btn-del  { background:rgba(255,68,68,0.12); color:#ff4444; border:1px solid #ff4444; margin-left:8px; }
        .btn-del:hover  { background:#ff4444; color:#fff; }

        /* Empty state */
        .empty-state { text-align:center; padding:60px 20px; color:var(--text-secondary); }
        .empty-state .icon { font-size:3rem; margin-bottom:15px; }

        /* Quick actions */
        .quick-actions { display:flex; gap:12px; flex-wrap:wrap; }
        .btn-action { padding:9px 20px; border-radius:6px; font-weight:600; font-size:0.88rem; border:2px solid var(--primary-color); color:var(--primary-color); transition:all 0.3s; }
        .btn-action:hover { background:var(--primary-color); color:#121212; }
        .btn-action.filled { background:var(--primary-color); color:#121212; }
        .btn-action.filled:hover { opacity:0.85; }

        footer { padding:30px; text-align:center; background:#000; color:#666; font-size:0.9rem; border-top:1px solid #222; }
        @media(max-width:768px){ .nav-links { display:none; } }
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

        <div class="page-header">
            <div>
                <h2>📋 All Students</h2>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px;">Student Registration Database</p>
            </div>
            <div class="quick-actions">
                <a href="registration.php" class="btn-action filled">+ Register New</a>
                <a href="search_student.php" class="btn-action">🔍 Search / Update</a>
            </div>
        </div>

        <?php if ($delete_msg): 
            [$type, $msg] = explode('|', $delete_msg, 2);
            $cls = $type === 'success' ? 'alert-success' : 'alert-danger';
        ?>
            <div class="alert <?= $cls ?>"><?= $msg ?></div>
        <?php endif; ?>

        <!-- Live client-side search -->
        <div class="search-bar">
            <input type="text" id="liveSearch" placeholder="🔎  Filter by name, roll no, or phone...">
        </div>

        <?php if ($total === 0): ?>
            <div class="empty-state">
                <div class="icon">🎓</div>
                <h3>No students registered yet.</h3>
                <p>Click <a href="registration.php" style="color:var(--primary-color);">Register New</a> to add the first student.</p>
            </div>
        <?php else: ?>
            <div style="margin-bottom:12px;">
                <span class="badge"><?= $total ?> student<?= $total > 1 ? 's' : '' ?> found</span>
            </div>
            <div class="table-wrap">
                <table id="studentTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Roll No / ID</th>
                            <th>Contact Number</th>
                            <th>Registered On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $i = 1; while ($row = mysqli_fetch_assoc($students)): ?>
                        <tr>
                            <td><?= $i++ ?></td>
                            <td><?= htmlspecialchars($row['first_name']) ?></td>
                            <td><?= htmlspecialchars($row['last_name']) ?></td>
                            <td><span class="roll-badge"><?= htmlspecialchars($row['roll_no']) ?></span></td>
                            <td><?= htmlspecialchars($row['phone']) ?></td>
                            <td style="color:var(--text-secondary);font-size:0.85rem;"><?= date('d M Y', strtotime($row['created_at'])) ?></td>
                            <td>
                                <a href="search_student.php?roll=<?= urlencode($row['roll_no']) ?>">
                                    <button class="btn-edit">✏ Edit</button>
                                </a>
                                <button class="btn-del"
                                    onclick="confirmDelete('<?= htmlspecialchars($row['roll_no']) ?>', '<?= htmlspecialchars($row['first_name'].' '.$row['last_name']) ?>')">
                                    🗑 Delete
                                </button>
                            </td>
                        </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

    </div>
</section>

<footer><p>&copy; 2024 Manasvi Shelke. All Rights Reserved.</p></footer>

<!-- Hidden delete form -->
<form id="deleteForm" method="GET" action="view_students.php" style="display:none;">
    <input type="hidden" id="deleteRollInput" name="delete_roll">
</form>

<script>
// Confirm & delete
function confirmDelete(rollNo, name) {
    if (confirm('⚠ Are you sure you want to delete student:\n\n' + name + ' (' + rollNo + ')?\n\nThis action cannot be undone.')) {
        document.getElementById('deleteRollInput').value = rollNo;
        document.getElementById('deleteForm').submit();
    }
}

// Live table filter
document.getElementById('liveSearch').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    const rows = document.querySelectorAll('#studentTable tbody tr');
    rows.forEach(function(row) {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
});
</script>
</body>
</html>