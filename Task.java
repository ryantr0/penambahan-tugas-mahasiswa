import java.util.Date;

public class Task {
    // ... (Atribut lain)
    // Ubah tipe data ini dari String menjadi Category
    private Category kategori; 
    private boolean isSelesai;

    // Modifikasi Konstruktor
    public Task(String namaTugas, String mataKuliah, Date deadline, Category kategori) {
        // ... (Inisialisasi atribut lain)
        this.kategori = kategori; // Sekarang menerima objek Category
        this.isSelesai = false; 
    }
    
    // Modifikasi Getter
    public Category getKategori() {
        return kategori;
    }
    
    // ... (Metode lain)
    
    // Modifikasi toString
    @Override
    public String toString() {
        // Panggil toString() dari objek Category
        String status = isSelesai ? "Selesai" : "Belum Selesai";
        return String.format("[%s] %s (%s) - Deadline: %s [Kategori: %s]",
                             status, namaTugas, mataKuliah, deadline.toString(), kategori.getNamaKategori());
    }
}