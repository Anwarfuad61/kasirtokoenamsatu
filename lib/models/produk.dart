class Produk {
  int? id;
  String nama;
  int harga;
  int stok;

  Produk({
    this.id,
    required this.nama,
    required this.harga,
    required this.stok,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'nama': nama,
      'harga': harga,
      'stok': stok,
    };
  }
}
