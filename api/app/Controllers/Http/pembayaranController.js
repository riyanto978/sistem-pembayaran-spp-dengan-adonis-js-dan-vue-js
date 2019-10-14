'use strict'

const Pembayaran = use('App/Models/pembayaran')
const Mahasiswa = use('App/Models/mahasiswa')
const Angkatan = use('App/Models/angkatan')
const Helpers = use('Helpers')
const Database = use('Database')

class PembayaranController {
    
    async tanggal({params,response}){

        const hariAwal = params.awal + " 00:00:00"
        const hariAkhir = params.akhir + " 23:59:59"

        const data = await Database
            .raw('select dibuat_tgl as tgl,sum(jumlah_tagihan) as tagihan from pembayaran where dibuat_tgl between ? and ? group by date(dibuat_tgl)', [hariAwal,hariAkhir])

        return response.json({
            chart : params.awal,
            data : data,
        })
    }

    async nomor() {
        const kuit = await Database.table("pembayaran").orderBy('id_kuitansi', 'desc').limit(1)
        var inisial = 'AMIK';
        var panjang = 12;
        if (kuit.length == 0) {
            var angka = 0
        } else {
            var angka = kuit[0].nomor_kuitansi.substr(4)
        }
        var angka = parseInt(angka)
        var angka = angka + 1
        var tmp = ""
        for (var i = 1; i <= (parseInt(panjang) - parseInt(inisial.length) - angka.toString().length); i++) {
            tmp = tmp + "0";
        }
        return inisial + tmp + angka
    }

    async ambil({ response }) {

        return response.json({
            data: await this.nomor()
        })
    }

    async kuitansiResume({ response, params }) {
        const mahasiswa = await Mahasiswa.find(params.id_mahasiswa)
        const angkatan = await Angkatan.find(mahasiswa.angkatan)
        const pembayaran = []

        const sudahBayarSpp = await Pembayaran.query().where('guna_pembayaran', 'spp').where('id_mahasiswa', mahasiswa.id_mahasiswa).getSum('total')
        if (await Pembayaran.query().where('guna_pembayaran', 'spp').where('id_mahasiswa', mahasiswa.id_mahasiswa).getSum('total') < 36) {
            const row = {
                nama: 'spp',
                kode: 'spp',
                tagihan: angkatan.spp,
                sisa: 36 - await Pembayaran.query().where('guna_pembayaran', 'spp').where('id_mahasiswa', mahasiswa.id_mahasiswa).getSum('total'),
                bayar: 0
            }
            pembayaran.push(row)
        }
        if (await Pembayaran.query().where('guna_pembayaran', 'ta').where('id_mahasiswa', mahasiswa.id_mahasiswa).getCount() != 1) {
            const row = {
                nama: 'ta',
                kode: 'ta',
                tagihan: angkatan.ta,
                sisa: 1,
                bayar: 0
            }
            pembayaran.push(row)
        }
        if (await Pembayaran.query().where('guna_pembayaran', 'wisuda').where('id_mahasiswa', mahasiswa.id_mahasiswa).getCount() != 1) {
            const row = {
                nama: 'wisuda',
                kode: 'wisuda',
                tagihan: angkatan.wisuda,
                sisa: 1,
                bayar: 0
            }
            pembayaran.push(row)
        }
        if (await Pembayaran.query().where('guna_pembayaran', 'her').where('id_mahasiswa', mahasiswa.id_mahasiswa).getCount() != 1) {
            const row = {
                nama: 'her',
                kode: 'her',
                tagihan: angkatan.her,
                sisa: 1,
                bayar: 0
            }
            pembayaran.push(row)
        }
        if (await Pembayaran.query().where('guna_pembayaran', 'penunjang').where('id_mahasiswa', mahasiswa.id_mahasiswa).getCount() != 1) {
            const row = {
                nama: 'penunjang',
                kode: 'penunjang',
                tagihan: angkatan.penunjang,
                sisa: 1,
                bayar: 0
            }
            pembayaran.push(row)
        }
        if (await Pembayaran.query().where('guna_pembayaran', 'registrasi').where('id_mahasiswa', mahasiswa.id_mahasiswa).getCount() != 1) {
            const row = {
                nama: 'registrasi',
                kode: 'registrasi',
                tagihan: angkatan.registrasi,
                sisa: 1,
                bayar: 0
            }
            pembayaran.push(row)
        }
        if (await Pembayaran.query().where('guna_pembayaran', 'spi').where('id_mahasiswa', mahasiswa.id_mahasiswa).getCount() != 1) {
            const row = {
                nama: 'spi',
                kode: 'spi',
                tagihan: angkatan.spi,
                sisa: 1,
                bayar: 0
            }
            pembayaran.push(row)
        }
        const subBayar = JSON.parse(angkatan.sub_bayar)

        for (const item of subBayar) {
            if (await Pembayaran.query().where('guna_pembayaran', item.kode_sub).where('id_mahasiswa', mahasiswa.id_mahasiswa).getCount() != 1) {
                const row = {
                    nama: item.nama_sub,
                    kode: item.kode_sub,
                    tagihan: item.tagihan,
                    sisa: 1,
                    bayar: 0
                }
                pembayaran.push(row)
            }
        }

        const history = await Pembayaran.query().where('id_mahasiswa',mahasiswa.id_mahasiswa).fetch();
        
        return response.json({
            sudahSpp: sudahBayarSpp,
            angkatan: angkatan,
            history : history,
            pembayaran: pembayaran
        })
    }

    async store({ request, response }) {
        const mahasiswa = JSON.parse(request.input("mahasiswa"))
        const bayar = JSON.parse(request.input("bayar"))
        const jumlah_bayar = request.input("jumlah_bayar")
        const nomor_kuitansi = await this.nomor()



        for (const item of bayar) {
            const kuitansi = new Pembayaran
            kuitansi.nomor_kuitansi = nomor_kuitansi
            kuitansi.id_mahasiswa = mahasiswa.id_mahasiswa
            kuitansi.guna_pembayaran = item.kode
            kuitansi.total = item.bayar
            kuitansi.jumlah_tagihan = item.bayar * item.tagihan
            kuitansi.jumlah_bayar = jumlah_bayar
            kuitansi.petugas = request.input("petugas")
            await kuitansi.save()
        }

        return response.status(200).json({

        })
    }

    async riwayat({ response, params }) {
        var cari = params.cari
        if (cari == 'null') {
            var search = ''
        } else {
            var search = cari
        }

        const kuitansi = await Pembayaran.query()
            .innerJoin('mahasiswa', 'pembayaran.id_mahasiswa', 'mahasiswa.id_mahasiswa')
            .where('pembayaran.nomor_kuitansi', 'LIKE', '%' + search + '%')
            .orWhere('nim', 'LIKE', '%' + search + '%')
            .paginate(params.page, 10)
        // const kuitansi = Database.raw('select * from kuitansi').getCount()

        return response.status(200).json({
            kuitansi: kuitansi
        })
    }

    async delete({ params }) {
        await Pembayaran.query().where('nomor_kuitansi',params.nomor_kuitansi).delete()        
    }
}

module.exports = PembayaranController