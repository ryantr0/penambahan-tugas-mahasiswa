// ====================================================================
// --- 1. KELAS OOP (User, Pengguna, Category) ---
// ====================================================================

// --- KELAS: User (Superclass untuk simulasi login) ---
class User {
    constructor(nim, name, password) {
        this.userId = nim; 
        this.name = name;
        this.password = password; 
    }
    login() { console.log(`User ${this.userId} berhasil login.`); }
    logout() { console.log(`User ${this.userId} logout.`); }
}

// --- KELAS: Pengguna (Subclass dari User) ---
class Pengguna extends User {
    constructor(nim, name, password) {
        super(nim, name, password); 
    }
}

// --- KELAS: Category (Digunakan di TaskListManager) ---
class Category {
    constructor(namaKategori) {
        this.namaKategori = namaKategori;
    }
    getNamaKategori() {
        return this.namaKategori;
    }
}

// --- KELAS: Task (Model Data) ---
class Task {
    constructor(namaTugas, mataKuliah, deadline, kategori, isSelesai = false) {
        this.id = Date.now() + Math.random(); 
        this.namaTugas = namaTugas;
        this.mataKuliah = mataKuliah;
        this.deadline = new Date(deadline); 
        this.kategori = kategori; // Ini adalah objek Category
        this.isSelesai = isSelesai;
    }

    getKategoriNama() {
        // Menggunakan method dari objek Category
        return this.kategori.getNamaKategori ? this.kategori.getNamaKategori() : this.kategori || 'Tidak Dikategorikan'; 
    }

    tandaiSelesai() {
        this.isSelesai = !this.isSelesai; 
    }
}


// ====================================================================
// --- 2. DATA DUMMY & LIST KATEGORI ---
// ====================================================================

const DUMMY_ACCOUNTS = [
    new Pengguna('103062300114', 'Muhamad Ryan Rizki', 'user123'),
    new Pengguna('103062300112', 'Ibnu Nazar', 'pass456'),
    new Pengguna('103062300111', 'Lionel Messi', 'peng123'),
];

const KATEGORI_LIST = [
    new Category("Tugas"),
    new Category("Quiz"),
    new Category("Tugas Besar"),
    new Category("Laporan")
];


// ====================================================================
// --- 3. KELAS: TaskListManager (Controller & Logic) ---
// ====================================================================
class TaskListManager {
    constructor() {
        this.daftarTugas = [];
        this.currentUser = null; 
        this.loginMessage = document.getElementById('login-message'); 

        this.setupEventListeners();
        this.checkLoginStatus(); 
    }

    // --- LOGIKA LOGIN/SCREEN SWITCHING ---
    checkLoginStatus() {
        const loggedInNim = localStorage.getItem('currentNim');
        if (loggedInNim) {
            const user = DUMMY_ACCOUNTS.find(acc => acc.userId === loggedInNim);
            if (user) {
                this.currentUser = user;
                this.loadTasks(); // Memuat tugas saat halaman dimuat (refresh)
                this.showAppScreen();
                return;
            }
        }
        this.showLoginScreen();
    }
    
    showLoginScreen() {
        const loginScreen = document.getElementById('login-screen');
        const appScreen = document.getElementById('main-app-screen');
        if (loginScreen) loginScreen.style.display = 'block';
        if (appScreen) appScreen.style.display = 'none';
    }

    showAppScreen() {
        const loginScreen = document.getElementById('login-screen');
        const appScreen = document.getElementById('main-app-screen');
        if (loginScreen) loginScreen.style.display = 'none';
        if (appScreen) appScreen.style.display = 'block'; 

        if (this.currentUser) {
            document.getElementById('user-name-display').textContent = this.currentUser.name;
        }
        
        this.populateFilterDropdown(); 
        this.filterAndRenderTasks();
    }

    login(nim, password) {
        const user = DUMMY_ACCOUNTS.find(acc => acc.userId === nim && acc.password === password);
        
        if (user) {
            this.currentUser = user; 
            localStorage.setItem('currentNim', user.userId); 
            user.login(); 
            this.loginMessage.textContent = '';
            
            this.loadTasks(); // <-- PERBAIKAN BUG LOGIN: Muat data tugas setelah login berhasil!
            
            this.showAppScreen();
            return true;
        } else {
            if (this.loginMessage) {
                this.loginMessage.textContent = 'NIM atau Password salah. Coba 103062300114 / user123';
            }
            return false;
        }
    }

    logout() {
        if (this.currentUser) {
            this.currentUser.logout();
        }
        localStorage.removeItem('currentNim');
        this.currentUser = null;
        this.daftarTugas = []; // Mengosongkan tampilan in-memory
        this.showLoginScreen();
    }

    // --- LOGIKA DATA DAN STORAGE ---
    saveTasks() {
        if (this.currentUser) {
            // Menggunakan NIM user sebagai kunci untuk isolasi data
            const key = `tasks_${this.currentUser.userId}`; 
            localStorage.setItem(key, JSON.stringify(this.daftarTugas));
        }
    }

    loadTasks() {
        if (!this.currentUser) return;

        const key = `tasks_${this.currentUser.userId}`;
        const tasksJson = localStorage.getItem(key);

        if (tasksJson) {
            const loadedTasks = JSON.parse(tasksJson);
            this.daftarTugas = loadedTasks.map(data => {
                const categoryName = data.kategori.namaKategori || data.kategori;
                const categoryObj = KATEGORI_LIST.find(c => c.getNamaKategori() === categoryName) || new Category(categoryName);
                
                const task = new Task(data.namaTugas, data.mataKuliah, data.deadline, categoryObj, data.isSelesai);
                task.id = data.id; 
                return task;
            });
            this.daftarTugas.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else {
            this.daftarTugas = [];
        }
    }
    
    // --- FUNGSI RENDER & FILTER (TIDAK ADA PERUBAHAN DI SINI) ---
    populateFilterDropdown() {
        const formCategorySelect = document.getElementById('task-category');
        const filterSelect = document.getElementById('category-filter');
        if (!formCategorySelect || !filterSelect) return;
        
        formCategorySelect.innerHTML = '<option value="Pilih Kategori" disabled selected>Pilih Kategori</option>';
        filterSelect.innerHTML = '<option value="Semua">Semua Kategori</option>';

        KATEGORI_LIST.forEach(kategori => {
            const name = kategori.getNamaKategori();
            
            let optionForm = document.createElement('option');
            optionForm.value = name;
            optionForm.textContent = name;
            formCategorySelect.appendChild(optionForm);
            
            let optionFilter = document.createElement('option');
            optionFilter.value = name;
            optionFilter.textContent = name;
            filterSelect.appendChild(optionFilter);
        });
    }
    
    filterAndRenderTasks() {
        const filterValue = document.getElementById('category-filter') ? document.getElementById('category-filter').value : 'Semua';
        const container = document.getElementById('task-list-container');
        const taskCountSpan = document.getElementById('task-count');
        if (!container || !taskCountSpan) return;

        container.innerHTML = ''; 
        
        if (!this.currentUser) {
            container.innerHTML = `<p>Silakan login untuk melihat dan mengelola tugas Anda.</p>`;
            document.getElementById('task-count').textContent = 0;
            return;
        }

        let filteredTasks = this.daftarTugas;
        
        if (filterValue !== 'Semua') {
            filteredTasks = this.daftarTugas.filter(t => t.getKategoriNama() === filterValue);
        }

        const sortedTasks = [...filteredTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        taskCountSpan.textContent = sortedTasks.length;

        if (sortedTasks.length === 0) {
            container.innerHTML = `<p>Tidak ada tugas yang ditemukan dalam kategori <b>${filterValue}</b>.</p>`;
            return;
        }

        sortedTasks.forEach(task => {
             const taskDiv = document.createElement('div');
             taskDiv.className = `task-item ${task.isSelesai ? 'completed' : ''}`;

             const today = new Date();
             const timeDiff = new Date(task.deadline).getTime() - today.getTime();
             const threeDays = 3 * 24 * 60 * 60 * 1000;
             let reminderText = '';
             
             if (!task.isSelesai) {
                  if (timeDiff < 0) {
                     reminderText = '🚨 LEWAT DEADLINE!';
                 } else if (timeDiff <= threeDays) {
                     reminderText = '❗ MENDESAK (Deadline dekat)!';
                 }
             }

             const deadlineDate = new Date(task.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});
             taskDiv.innerHTML = `
                 <div class="task-details-wrapper">
                     <p>
                         <span class="task-name">${task.namaTugas}</span> 
                         <span class="category-tag">(${task.getKategoriNama()})</span>
                     </p>
                     <p class="task-meta">
                        Mata Kuliah: ${task.mataKuliah || '-'} | Deadline: ${deadlineDate} 
                        <span class="reminder">${reminderText}</span>
                     </p>
                 </div>
                 <div class="task-actions">
                    <button onclick="taskManager.tandaiSelesai(${task.id})">
                        ${task.isSelesai ? 'Batal Selesai' : 'Selesaikan'}
                    </button>
                    <button onclick="taskManager.hapusTugas(${task.id})">Hapus</button>
                 </div>
             `;
             container.appendChild(taskDiv);
        });
    }

    // --- FUNGSI CRUD Sederhana ---
    tambahTugas(task) {
        this.daftarTugas.push(task);
        this.saveTasks();
        this.filterAndRenderTasks(); 
    }
    
    tandaiSelesai(taskId) {
        const task = this.daftarTugas.find(t => t.id === taskId);
        if (task) {
            task.tandaiSelesai();
            this.saveTasks();
            this.filterAndRenderTasks(); 
        }
    }
    
    hapusTugas(taskId) {
        this.daftarTugas = this.daftarTugas.filter(t => t.id !== taskId);
        this.saveTasks();
        this.filterAndRenderTasks(); 
    }

    // --- SETUP EVENT LISTENERS (TIDAK ADA PERUBAHAN DI SINI) ---
    setupEventListeners() {
        const form = document.getElementById('task-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault(); 
        
                const name = document.getElementById('task-name').value;
                const course = document.getElementById('task-course').value;
                const deadline = document.getElementById('task-deadline').value;
                const categoryName = document.getElementById('task-category').value;
                
                if (categoryName === 'Pilih Kategori') {
                    alert("Harap pilih kategori tugas.");
                    return;
                }
                
                const categoryObj = KATEGORI_LIST.find(c => c.getNamaKategori() === categoryName);
        
                const newTask = new Task(name, course, deadline, categoryObj);
                this.tambahTugas(newTask);
        
                form.reset(); 
            });
        }
        
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.logout();
            });
        }
    }
}


// ====================================================================
// --- 4. INISIALISASI APLIKASI ---
// ====================================================================

let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskListManager();

    // Event listener khusus untuk FORM LOGIN
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nim = document.getElementById('nim').value.trim();
            const password = document.getElementById('password').value;
            
            taskManager.login(nim, password); 
        });
    }
});