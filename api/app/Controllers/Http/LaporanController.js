'use strict'
const Database = use('Database')
const Pol = use('App/Models/Pol')
const Lot = use('App/Models/Lot')
const Reguler = use('App/Models/Reguler')
const Helpers = use('Helpers')

class LaporanController {

    async inerReguler({ request, response }) {
        const pol = await Pol.find(request.params.id_pol)
        const lot = await Lot.query().where('id_pol', request.params.id_pol).getSum('jumlah')
        const jumlahIner = Math.ceil(lot / pol.per_iner)

        const arr = []
        for (let index = 1; index <= jumlahIner; index++) {
            if (await Database.from('reguler').where('id_pol', pol.id_pol).where('proses_ke', 1).where('iner', index).getCount() == 0) {
                var row = {
                    iner: index,
                    isi: 250
                }
                arr.push(row)
            }
        }

        return response.json({
            data: arr
        })
    }

    async inerRegulerke({ params, response }) {

        const reguler = await Reguler.query().where('id_pol', params.id_pol).where('proses_ke', params.ke).where('status', 2).fetch()

        return response.json({
            data: reguler
        })
    }

    async allLaporan({ params, response }) {
        const data = await Database.raw("SELECT a.operator as oplama,b.* FROM `reguler` as a right join reguler as b on a.id_laporan = b.old where b.id_pol = ? and b.proses_ke = ? and b.operator =?"
            , [params.id_pol, params.proses_ke, params.operator])
        return response.json({
            // data: await Reguler.query().where('id_pol', params.id_pol)
            //     .where('proses_ke', params.proses_ke).where('operator', params.operator).fetch()
            data: data[0]
        })
    }

    async resumeHome({ params, response }) {
        var tanggalAwal = params.tanggal + ' 00:00:00'
        var tanggalAkhir = params.tanggal + ' 23:59:59'
        const data = await Reguler.query()
            .innerJoin('pol', 'pol.id_pol', 'reguler.id_pol')
            .where('operator', params.operator)
            .whereBetween('reguler.created_at', [tanggalAwal, tanggalAkhir]).groupBy('pol.id_pol').fetch()            
        const arr = []        
        for (const item of data.rows) {
            const lap = await Reguler.query()
                .select('*', 'reguler.created_at', 'reguler.updated_at')
                .innerJoin('proses', 'reguler.id_proses', 'proses.id_proses')
                .where('id_pol', item.id_pol).where('operator', params.operator)
                .whereBetween('reguler.created_at', [tanggalAwal, tanggalAkhir]).fetch()

            const row = {
                pol: item.kode_pol,
                nama_pol: item.nama_pol,
                data: lap
            }
            arr.push(row)
        }

        return response.json({
            data: arr
        })
    }

    async resume({ params, response }) {
        var tanggalAwal = params.tanggal + ' 00:00:00'
        var tanggalAkhir = params.tanggal + ' 23:59:59'
        const data = await Reguler.query()
            .innerJoin('pol', 'pol.id_pol', 'reguler.id_pol')
            .where('shift', params.shift)
            .whereBetween('reguler.created_at', [tanggalAwal, tanggalAkhir]).groupBy('pol.id_pol').fetch()
        const arr = []
        for (const item of data.rows) {
            const lap = await Reguler.query()
                .select('*', 'reguler.created_at', 'reguler.updated_at')
                .innerJoin('proses', 'reguler.id_proses', 'proses.id_proses')
                .where('id_pol', item.id_pol).where('shift', params.shift)
                .whereBetween('reguler.created_at', [tanggalAwal, tanggalAkhir]).fetch()

            const row = {
                pol: item.kode_pol,
                nama_pol: item.nama_pol,
                data: lap
            }
            arr.push(row)
        }
        return response.json({
            data: arr
        })
    }

    async monitoring({ params, response }) {
        var tanggalAwal = params.tanggal + ' 00:00:00'
        var tanggalAkhir = params.tanggal + ' 23:59:59'

        const data = await Database.raw("select sum(reguler.dead) as dead,sum(reguler.chip_lemah) as lemah,sum(reguler.chip_error) as error,proses.nama_proses as proses,sum(reguler.isi) as total,pol.nama_pol,pol.kode_pol from reguler INNER JOIN pol on reguler.id_pol = pol.id_pol Inner join proses on proses.id_proses = reguler.id_proses where shift=? and reguler.created_at between ? and ?  and reguler.status <> '1' group by reguler.id_proses,reguler.id_pol order By pol.kode_pol", [params.shift, tanggalAwal, tanggalAkhir])
        const total = await Reguler.query()
            .innerJoin('pol','pol.id_pol','reguler.id_pol')
            .innerJoin('proses', 'proses.id_proses', 'reguler.id_proses')
            .whereBetween('reguler.created_at', [tanggalAwal, tanggalAkhir])            
            .where('shift', params.shift)
            .groupBy('reguler.id_pol','reguler.id_proses')
            .fetch()

        const arr = []
        for (const item of total.rows) {
            const cari = await Database.raw("Select operator, sum(isi) as total, sum(chip_lemah + chip_error + dead + card_body) as reject FROM `reguler` where created_at BETWEEN ? and ? and shift = ? and id_pol =? and id_proses =? GROUP by reguler.id_pol, reguler.id_proses, operator",[tanggalAwal,tanggalAkhir,params.shift,item.id_pol,item.id_proses])            
            const row = {
                header: item,
                line: {
                    columns: ['operator', 'total', 'reject'],
                    rows: cari[0]
                }
            }
            arr.push(row)
        }

        return response.json({
            data: data[0],
            total: arr
        })

    }

    async store({ request, response }) {

        const data = Reguler.query().where('id_pol', request.input('id_pol')).where('proses_ke', request.input('proses_ke'))
            .getCount()

        if (data > 0) {
            return response.status(400).json({

            })
        } else {
            if (request.input('old') != null) {
                const laporan = await Reguler.find(request.input('old'))
                laporan.status = 3
                await laporan.save()
            }

            const regulerData = request.only(['id_pol', 'iner', 'isi', 'id_proses', 'proses_ke', 'shift', 'line', 'operator', 'status', 'old'])
            const reguler = await Reguler.create(regulerData)
            const created_at = await Reguler.find(reguler.id_laporan)
            created_at.created_at = new Date((new Date) * 1 - 1000 * 3600 * 7)
            created_at.updated_at = new Date((new Date) * 1 - 1000 * 3600 * 7)
            await created_at.save()

            const data = await Database.raw("SELECT a.operator as oplama, b.* FROM`reguler` as a right join reguler as b on a.id_laporan = b.old where b.id_laporan = ?", [reguler.id_laporan])
            return response.json({
                // reguler: await Reguler.find(reguler.id_laporan) 
                reguler: data[0][0]
            })
        }


    }

    async update({ params, request, response }) {
        const reguler = await Reguler.find(params.id)
        if (reguler.id_lot != null) {
            const lot = await Lot.find(reguler.id_lot)
            lot.reject -= (parseInt(reguler.dead) + parseInt(reguler.chip_lemah) + parseInt(reguler.chip_error) + parseInt(reguler.card_body))
            await lot.save()
        }

        if (request.file('log') != undefined) {
            const dataLog = request.file('log', {
                size: '2mb'
            })
            await dataLog.move(Helpers.publicPath(), {
                name: reguler.operator + ' ' + dataLog.clientName,
                overwrite: true
            })

            reguler.log = reguler.operator + ' ' + dataLog.clientName
        }
        reguler.id_lot = request.input('id_lot')
        reguler.dead = request.input('dead', 0)
        reguler.chip_lemah = request.input('chip_lemah', 0)
        reguler.chip_error = request.input('chip_error', 0)
        reguler.card_body = request.input('card_body', 0)


        if (reguler.status == 1) {
            reguler.status = 2
        }
        // reguler.nama_proses = request.input('nama_proses')            
        await reguler.save()

        const created_at = await Reguler.find(reguler.id_laporan)
        created_at.updated_at = new Date((new Date) * 1 - 1000 * 3600 * 7)
        await created_at.save()

        const lot = await Lot.find(reguler.id_lot)
        lot.reject += (parseInt(reguler.dead) + parseInt(reguler.chip_lemah) + parseInt(reguler.chip_error) + parseInt(reguler.card_body))
        lot.good = lot.jumlah - lot.reject
        await lot.save()
        const data = await Database.raw("SELECT a.operator as oplama, b.* FROM`reguler` as a right join reguler as b on a.id_laporan = b.old where b.id_laporan = ?", [reguler.id_laporan])
        return response.json({
            reguler: data[0][0]
        })
    }

    async destroy({ params, request, response }) {

        const reguler = await Reguler.find(params.id)
        if (reguler.old != null) {
            const old = await Reguler.find(reguler.old)
            old.status = 2
            await old.save()
        }
        if (reguler.id_lot != null) {
            const lot = await Lot.find(reguler.id_lot)
            lot.reject -= (parseInt(reguler.dead) + parseInt(reguler.chip_lemah) + parseInt(reguler.chip_error) + parseInt(reguler.card_body))
            lot.good = lot.jumlah - lot.reject
            await lot.save()
        }
        await reguler.delete()
    }

}
module.exports = LaporanController
