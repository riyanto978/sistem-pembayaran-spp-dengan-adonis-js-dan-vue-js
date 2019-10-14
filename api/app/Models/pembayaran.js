'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pembayaran extends Model {
    static get table() {
        return 'pembayaran'
    }
    static get primaryKey() {
        return 'id_kuitansi'
    }

    static get createdAtColumn() {
        return 'dibuat_tgl'
    }

    static get updatedAtColumn() {
        return 'diubah_tgl'
    }

    
}

module.exports = Pembayaran
