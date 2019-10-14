'use strict'
const Database = use('Database')
const Lot = use('App/Models/Lot')


class LotController {

    async dataLot({ params, request, response }) {

        return response.json({
            data: await Lot.query().where('id_pol', params.id_pol).orderBy('id_lot', 'desc').fetch()
        })
    }

    async store({ request, response }) {
        const lotData = request.only(['id_pol', 'kd_lot', 'jumlah', 'reject', 'good'])
        const lot = await Lot.create(lotData)
        return response.json({ lot: lot })
    }

    async update({ params, request, response }) {
        const lot = await Lot.find(params.id)
        
        if (lot.reject > request.input('jumlah')) {
            return response.status(400).json({
                status: 'reject lebih besar',
                message: 'There was a problem updating the Proses, please try again later.'
            })
        } else {            
            lot.kd_lot = request.input('kd_lot')
            lot.jumlah = request.input('jumlah')
            lot.good = request.input('jumlah') - lot.reject
            await lot.save()
            return response.json({
                lot: lot
            })
        }
    }

    async destroy({ params, request, response }) {
        const lot = await Lot.find(params.id)
        await lot.delete()
    }

}

module.exports = LotController
