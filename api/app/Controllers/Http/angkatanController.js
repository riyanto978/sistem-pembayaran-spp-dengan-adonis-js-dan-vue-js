'use strict'
const Angkatan = use('App/Models/angkatan')

class angkatanController {

    async index({ response }) {
        return response.json({
            data: await Angkatan.all()
        })
    }

    async aktif({ response }) {
        return response.json({
            data: await Angkatan.query().where('status','aktif').fetch()
        })
    }

    async store({ request, response }) {
        const angkatanData = request.only(['nama_angkatan', 'thn_ajaran', 'tgl_mulai', 'her', 'penunjang','registrasi','spi','spp','ta','wisuda','status','sub_bayar'])
        const angkatan = await Angkatan.create(angkatanData)
        return response.json({ angkatan: angkatan })
    }

    async destroy({ params }) {
        const angkatan = await Angkatan.find(params.id)
        await angkatan.delete()
    }

    async update({ params, request, response }) {
        
        const angkatan = await Angkatan.find(params.id)
        angkatan.nama_angkatan = request.input('nama_angkatan')
        angkatan.thn_ajaran = request.input('thn_ajaran')
        angkatan.tgl_mulai = request.input('tgl_mulai')
        angkatan.her = request.input('her')
        angkatan.penunjang = request.input('penunjang')
        angkatan.registrasi = request.input('registrasi')
        angkatan.spi = request.input('spi')
        angkatan.spp = request.input('spp')
        angkatan.ta = request.input('ta')
        angkatan.wisuda = request.input('wisuda')
        angkatan.status = request.input('status')

        
        angkatan.sub_bayar = request.input('sub_bayar')
        await angkatan.save()

        return response.json({
            angkatan: angkatan
        })
    }
}
module.exports = angkatanController
