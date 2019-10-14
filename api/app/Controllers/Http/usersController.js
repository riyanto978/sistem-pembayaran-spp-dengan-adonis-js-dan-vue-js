'use strict'

const User = use('App/Models/User')
const Helpers = use('Helpers')
const Database = use('Database')

class usersController {

    async store({ request, response }) {


        const profilePic = request.file('foto', {
            types: ['image'],
            size: '5mb'
        })
        await profilePic.move(Helpers.publicPath('foto'), {
            name: profilePic.clientName,
            overwrite: true
        })

        const User = new User()
        User.name = request.input('name')
        User.username = request.input('username')
        User.jenis_kelamin = request.input('jenis_kelamin')
        User.alamat = request.input('alamat')
        User.agama = request.input('agama')
        User.program_studi = request.input('program_studi')
        User.telepon = request.input('telepon')
        User.angkatan = request.input('angkatan')
        User.kelas = request.input('kelas')
        User.foto = profilePic.clientName
        await User.save()

        return response.json({
            data: User
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

        const User = await User.query()
        .innerJoin('angkatan','angkatan.id_angkatan','User.angkatan')
        .where('nim', 'LIKE', '%' + search + '%')
        .orWhere('nama_User', 'LIKE', '%' + search + '%')
        .paginate(params.page, 5)
        return response.json({
            data: User
        })
    }

    async resume({ response, params }) {
        var cari = params.cari
        if (cari == 'null') {
            var search = ''
        } else {
            var search = cari
        }

        const User = await Database.table('User')  
            .where('angkatan',params.angkatan)
            .where('nim', 'LIKE', '%' + search + '%')            
            .paginate(params.page, 5)
        
        var angkatan = await Angkatan.find(params.angkatan)
        var subBayar = JSON.parse(angkatan.sub_bayar)
        var dataUser = []
        for(const item of User.data){
            var obj = {
                foto : item.foto,
                nim : item.nim,
                nama_User : item.nama_User,
                her : await Database.select('jumlah_tagihan').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran','her').getSum('jumlah_tagihan'),
                penunjang: await Database.select('jumlah_tagihan').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran', 'penunjang').getSum('jumlah_tagihan'),
                registrasi: await Database.select('jumlah_tagihan').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran', 'registrasi').getSum('jumlah_tagihan'),
                spi: await Database.select('jumlah_tagihan').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran', 'spi').getSum('jumlah_tagihan'),
                ta: await Database.select('jumlah_tagihan').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran', 'ta').getSum('jumlah_tagihan'),
                wisuda: await Database.select('jumlah_tagihan').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran', 'wisuda').getSum('jumlah_tagihan'),                
                spp: await Database.select('total').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran', 'spp').getSum('total')                
            }

            for(const dat of subBayar){                
                obj[dat.kode_sub] = await Database.select('jumlah_tagihan').from('pembayaran').where('id_User', item.id_User).where('guna_pembayaran', dat.kode_sub).getSum('jumlah_tagihan')
            }

            dataUser.push(obj)
        }
            
        return response.json({
            data: dataUser,
            total : User.total
        })
    }

    async destroy({ params, request, response }) {
        const User = await User.find(params.id)
        await User.delete()
    }

    async update({ params, request, response }) {

        const User = await User.find(params.id)
        if (request.file('foto') != undefined) {            
            const profilePic = request.file('foto', {
                types: ['image'],
                size: '2mb'
            })

            await profilePic.move(Helpers.publicPath('foto'), {
                name: profilePic.clientName,
                overwrite: true
            })

            User.foto = profilePic.clientName
        }

        User.nim = request.input('nim')
        User.nama_User = request.input('nama_User')
        User.jenis_kelamin = request.input('jenis_kelamin')
        User.alamat = request.input('alamat')
        User.agama = request.input('agama')
        User.program_studi = request.input('program_studi')
        User.telepon = request.input('telepon')
        User.angkatan = request.input('angkatan')
        User.kelas = request.input('kelas')            
        await User.save()

        return response.json({            
            data: User
        })
    }

}

module.exports = UserController