public class Category {
    private String categoryId; // Opsional: Untuk identifikasi unik
    private String namaKategori;

    // Konstruktor
    public Category(String categoryId, String namaKategori) {
        this.categoryId = categoryId;
        this.namaKategori = namaKategori;
    }

    // Metode Getter
    public String getNamaKategori() {
        return namaKategori;
    }

    // Metode Setter
    public void setNamaKategori(String namaKategori) {
        this.namaKategori = namaKategori;
    }

    // Representasi String
    @Override
    public String toString() {
        return namaKategori;
    }
}