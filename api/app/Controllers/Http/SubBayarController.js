'use strict'
const Sub = use('App/Models/subBayar')

class SubBayarController {

    async index({ response }) {
        return response.json({
            data: await Sub.all()
        })
    }

    async store({ request, response }) {
        const subBayar = request.only(['kode_sub', 'nama_sub', 'tagihan', 'status', 'keterangan'])
        const sub = await Sub.create(subBayar)
        return response.json({ sub: sub })
    }

    async destroy({ params }) {
        const subBayar = await Sub.find(params.id)
        await subBayar.delete()
    }

    async update({ params, request, response }) {

        const sub = await Sub.find(params.id)
        sub.kode_sub = request.input('kode_sub')
        sub.nama_sub = request.input('nama_sub')
        sub.status = request.input('status')
        sub.tagihan = request.input('tagihan')
        sub.keterangan = request.input('keterangan')
        
        await sub.save()

        return response.json({
            sub: sub
        })
    }
}
module.exports = SubBayarController
