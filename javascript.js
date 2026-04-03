// إدارة وضع الورق (Sepia)
function toggleSepia() {
    document.body.classList.toggle('sepia-mode');
    localStorage.setItem('sepiaMode', document.body.classList.contains('sepia-mode'));
}

// عرض المكتبة من الذاكرة المحلية
function displayBooks() {
    const shelf = document.getElementById('book-shelf');
    
    // بيانات أولية إذا كانت الذاكرة فارغة
    let data = JSON.parse(localStorage.getItem('myAdvancedLib')) || [
        {title: "كتاب البخلاء", desc: "من أشهر كتب الجاحظ، يصور حياة البخلاء بأسلوب فكاهي ونقدي.", type: "text", date: "2026/04/01"},
        {title: "أسرار طمبو والذهب", desc: "أسطورة تونسية قديمة تحكي عن الكنوز المخفية في الصحراء.", type: "text", date: "2026/04/03"}
    ];
    
    shelf.innerHTML = '';

    data.forEach((item, index) => {
        const cover = document.createElement('div');
        cover.className = 'book-cover';
        cover.onclick = () => openStory(index); // تفعيل الضغط

        let icon = item.type === 'pdf' ? 'fa-file-pdf' : (item.type === 'image' ? 'fa-file-image' : 'fa-book-open');

        cover.innerHTML = `
            <div style="position:absolute; top:10px; right:10px; background:var(--gold); color:white; padding:3px 10px; font-size:10px; border-radius:5px; font-weight:bold;">
                ${item.type.toUpperCase()}
            </div>
            <i class="fas ${icon} main-icon"></i>
            <h3>${item.title}</h3>
            <p style="font-size: 0.8rem; opacity: 0.7;">انقر لكشف السر</p>
        `;
        shelf.appendChild(cover);
    });

    localStorage.setItem('myAdvancedLib', JSON.stringify(data));
}

// إضافة قصة جديدة للرف
function addNewStory() {
    const title = document.getElementById('newTitle').value;
    const desc = document.getElementById('newDesc').value;
    const type = document.getElementById('newType').value;

    if (!title || !desc) {
        alert("من فضلك، املأ العنوان والمحتوى أولاً!");
        return;
    }

    const newStory = {
        title: title,
        desc: desc,
        type: type,
        date: new Date().toLocaleDateString('ar-TN'),
        isFavorite: false
    };

    let data = JSON.parse(localStorage.getItem('myAdvancedLib')) || [];
    data.push(newStory);
    localStorage.setItem('myAdvancedLib', JSON.stringify(data));

    // إعادة ضبط الحقول وتحديث العرض
    document.getElementById('newTitle').value = '';
    document.getElementById('newDesc').value = '';
    displayBooks();
    alert("تم حفظ السر الجديد بنجاح في المكتبة!");
}

// عرض تفاصيل القصة
function openStory(index) {
    const data = JSON.parse(localStorage.getItem('myAdvancedLib'));
    const story = data[index];
    
    document.getElementById('modalTitle').innerText = story.title;
    document.getElementById('modalDesc').innerText = story.desc;
    document.getElementById('modalDate').innerText = story.date;
    document.getElementById('storyModal').style.display = "block";
}

function closeStory() {
    document.getElementById('storyModal').style.display = "none";
}

// البحث في العناوين
function searchBooks() {
    let val = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.book-cover').forEach(card => {
        let title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(val) ? "flex" : "none";
    });
}

// عند تحميل الصفحة
window.onload = () => {
    if(localStorage.getItem('sepiaMode') === 'true') {
        document.body.classList.add('sepia-mode');
    }
    displayBooks();
};

// إغلاق النافذة عند الضغط خارجها
window.onclick = (e) => {
    if(e.target.classList.contains('modal')) closeStory();
};