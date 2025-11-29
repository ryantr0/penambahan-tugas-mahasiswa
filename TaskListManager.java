// ... (Bagian import)
public class TaskListManager {
    private List<Task> daftarTugas;
    private List<Category> daftarKategori; // Tambahkan list untuk mengelola kategori

    public TaskListManager() {
        this.daftarTugas = new ArrayList<>();
        this.daftarKategori = new ArrayList<>();
    }

    // Metode Baru: Menambahkan Kategori
    public void tambahKategori(Category category) {
        daftarKategori.add(category);
    }
    
    // Metode Baru: Filter berdasarkan Kategori
    public List<Task> filterByKategori(String namaKategori) {
        List<Task> filteredList = new ArrayList<>();
        for (Task t : daftarTugas) {
            // Bandingkan nama kategori
            if (t.getKategori() != null && t.getKategori().getNamaKategori().equalsIgnoreCase(namaKategori)) {
                filteredList.add(t);
            }
        }
        return filteredList;
    }
    
    // ... (Metode lama seperti tambahTugas, hapusTugas, cekReminder, dll.)
}