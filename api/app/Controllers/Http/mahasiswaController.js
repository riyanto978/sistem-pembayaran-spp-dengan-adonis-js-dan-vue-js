'use strict'

const Mahasiswa = use('App/Models/mahasiswa')
const Helpers = use('Helpers')
const Database = use('Database')
const Angkatan = use('App/Models/angkatan')
class mahasiswaController {

    async store({ request, response }) {


        const profilePic = request.file('foto', {
            types: ['image'],
            size: '5mb'
        })
        await profilePic.move(Helpers.publicPath('foto'), {
            name: profilePic.clientName,
            overwrite: true
        })

        const mahasiswa = new Mahasiswa()
        mahasiswa.nim = request.input('nim')
        mahasiswa.nama_mahasiswa = request.input('nama_mahasiswa')
        mahasiswa.jenis_kelamin = request.input('jenis_kelamin')
        mahasiswa.alamat = request.input('alamat')
        mahasiswa.agama = request.input('agama')
        mahasiswa.program_studi = request.input('program_studi')
        mahasiswa.telepon = request.input('telepon')
        mahasiswa.angkatan = request.input('angkatan')
        mahasiswa.kelas = request.input('kelas')
        mahasiswa.foto = profilePic.clientName
        await mahasiswa.save()

        return response.json({
            data: mahasiswa
        })
    }

    async login({ request, auth, response }) {
        const { username, password } = request.only(['username', 'password'])

        try {
            const token = await auth.attempt(username, password)
            let user = await User.findBy('username', username)
            return response.json({
                user: user,
                token: token
            })
        } catch (error) {
            console.log(error)
            response.status(400).json({
                status: 'error',
                message: 'Invalid username/password.'
            })
        }
    }

    async me({ auth, response }) {
        console.log("hi")
        return response.json({
            status: 'success',
            data: auth.user
        })
    }

    async all({ response, params }) {
        var cari = params.cari
        if (cari == 'null') {
            var search = ''
        } else {
            var search = cari
        }

        const mahasiswa = await Mahasiswa.query()
        .innerJoin('angkatan','angkatan.id_angkatan','mahasiswa.angkatan')
        .where('nim', 'LIKE', '%' + search + '%')
        .orWhere('nama_mahasiswa', 'LIKE', '%' + search + '%')
        .paginate(params.page, 5)
        return response.json({
            data: mahasiswa
        })
    }

    async resume({ response, params }) {
        var cari = params.cari
        if (cari == 'null') {
            var search = ''
        } else {
            var search = cari
        }

        const mahasiswa = await Database.table('mahasiswa')  
            .where('angkatan',params.angkatan)
            .where('nim', 'LIKE', '%' + search + '%')            
            .paginate(params.page, 5)
        
        var angkatan = await Angkatan.find(params.angkatan)
        var subBayar = JSON.parse(angkatan.sub_bayar)
        var dataMahasiswa = []
        for(const item of mahasiswa.data){
            var obj = {
                foto : item.foto,
                nim : item.nim,
                nama_mahasiswa : item.nama_mahasiswa,
                her : await Database.select('jumlah_tagihan').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran','her').getSum('jumlah_tagihan'),
                penunjang: await Database.select('jumlah_tagihan').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran', 'penunjang').getSum('jumlah_tagihan'),
                registrasi: await Database.select('jumlah_tagihan').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran', 'registrasi').getSum('jumlah_tagihan'),
                spi: await Database.select('jumlah_tagihan').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran', 'spi').getSum('jumlah_tagihan'),
                ta: await Database.select('jumlah_tagihan').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran', 'ta').getSum('jumlah_tagihan'),
                wisuda: await Database.select('jumlah_tagihan').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran', 'wisuda').getSum('jumlah_tagihan'),                
                spp: await Database.select('total').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran', 'spp').getSum('total')                
            }

            for(const dat of subBayar){                
                obj[dat.kode_sub] = await Database.select('jumlah_tagihan').from('pembayaran').where('id_mahasiswa', item.id_mahasiswa).where('guna_pembayaran', dat.kode_sub).getSum('jumlah_tagihan')
            }

            dataMahasiswa.push(obj)
        }
            
        return response.json({
            data: dataMahasiswa,
            total : mahasiswa.total
        })
    }

    async destroy({ params, request, response }) {
        const mahasiswa = await Mahasiswa.find(params.id)
        await mahasiswa.delete()
    }

    async update({ params, request, response }) {

        const mahasiswa = await Mahasiswa.find(params.id)
        if (request.file('foto') != undefined) {            
            const profilePic = request.file('foto', {
                types: ['image'],
                size: '2mb'
            })

            await profilePic.move(Helpers.publicPath('foto'), {
                name: profilePic.clientName,
                overwrite: true
            })

            mahasiswa.foto = profilePic.clientName
        }

        mahasiswa.nim = request.input('nim')
        mahasiswa.nama_mahasiswa = request.input('nama_mahasiswa')
        mahasiswa.jenis_kelamin = request.input('jenis_kelamin')
        mahasiswa.alamat = request.input('alamat')
        mahasiswa.agama = request.input('agama')
        mahasiswa.program_studi = request.input('program_studi')
        mahasiswa.telepon = request.input('telepon')
        mahasiswa.angkatan = request.input('angkatan')
        mahasiswa.kelas = request.input('kelas')            
        await mahasiswa.save()

        return response.json({            
            data: mahasiswa
        })
    }

}

module.exports = mahasiswaController