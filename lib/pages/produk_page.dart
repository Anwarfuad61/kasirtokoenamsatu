import 'package:flutter/material.dart';
import '../db/database_helper.dart';
import '../models/produk.dart';

class ProdukPage extends StatefulWidget {
  const ProdukPage({super.key});

  @override
  State<ProdukPage> createState() => _ProdukPageState();
}

class _ProdukPageState extends State<ProdukPage> {
  final namaController = TextEditingController();
  final hargaController = TextEditingController();
  final stokController = TextEditingController();

  void simpanProduk() async {
    final produk = Produk(
      nama: namaController.text,
      harga: int.parse(hargaController.text),
      stok: int.parse(stokController.text),
    );

    final db = await DatabaseHelper.instance.database;
    await db.insert('produk', produk.toMap());

    namaController.clear();
    hargaController.clear();
    stokController.clear();

    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Produk tersimpan')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Input Produk')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: namaController, decoration: const InputDecoration(labelText: 'Nama Barang')),
            TextField(controller: hargaController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Harga')),
            TextField(controller: stokController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Stok')),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: simpanProduk,
              child: const Text('SIMPAN'),
            )
          ],
        ),
      ),
    );
  }
}
