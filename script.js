let adminActive = false;

// إدارة الزيارات
let visits = localStorage.getItem('site_v') || 0;
visits++;
localStorage.setItem('site_v', visits);

function toggleMode() {
    document.body.classList.toggle('sepia-mode');
    document.body.classList.toggle('dark-mode');
}

function handleAdminAuth() {
    let p = prompt("أدخل مفتاح الخزانة:");
    if(p === "1234") {
        adminActive = !adminActive;
        document.getElementById('adminPanel').style.display = 'flex';
        updateStats();
        renderBooks();
    }
}

function triggerRoseEffect() {
    const file = document.getElementById('fileUpload').files[0];
    document.getElementById('fileLabel').innerText = file ? "تم اختيار: " + file.name : "";
    
    const garden = document.getElementById('rose-garden');
    garden.innerHTML = '';
    garden.style.display = 'block';

    for(let i=0; i<12; i++) {
        let rose = document.createElement('div');
        rose.className = 'falling-rose';
        rose.style.left = Math.random() * 100 + "%";
        rose.style.animationDelay = Math.random() * 0.5 + "s";
        garden.appendChild(rose);
    }
    setTimeout(() => garden.style.display = 'none', 3000);
}

async function saveToVault() {
    let t = document.getElementById('storyTitle').value;
    let c = document.getElementById('storyContent').value;
    let f = document.getElementById('fileUpload').files[0];

    if(!t || !c) return alert("البيانات ناقصة!");

    let fileBase64 = f ? await toBase64(f) : null;
    let db = JSON.parse(localStorage.getItem('vault_db')) || [];
    db.push({ title: t, content: c, file: fileBase64, liked: false });
    
    localStorage.setItem('vault_db', JSON.stringify(db));
    document.getElementById('storyTitle').value = '';
    document.getElementById('storyContent').value = '';
    closeAdmin();
    renderBooks();
}

function renderBooks() {
    let grid = document.getElementById('book-grid');
    let db = JSON.parse(localStorage.getItem('vault_db')) || [];
    grid.innerHTML = '';

    db.forEach((item, index) => {
        let card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div onclick="viewSecret(${index})">
                <i class="fas fa-scroll fa-3x" style="color:var(--gold)"></i>
                <h3>${item.title}</h3>
            </div>
            ${adminActive ? `<i class="fas fa-trash-alt" style="color:red" onclick="deleteSecret(${index})"></i>` : ''}
        `;
        grid.appendChild(card);
    });
}

const toBase64 = file => new Promise((res, rej) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = () => res(r.result);
});

function updateStats() {
    let db = JSON.parse(localStorage.getItem('vault_db')) || [];
    document.getElementById('v-count').innerText = localStorage.getItem('site_v');
    document.getElementById('l-count').innerText = db.length; 
}

function closeAdmin() { document.getElementById('adminPanel').style.display = 'none'; }
function viewSecret(i) {
    let db = JSON.parse(localStorage.getItem('vault_db'));
    document.getElementById('modalTitle').innerText = db[i].title;
    document.getElementById('modalBody').innerText = db[i].content;
    document.getElementById('viewModal').style.display = 'flex';
}
function closeModal() { document.getElementById('viewModal').style.display = 'none'; }

window.onload = renderBooks;