'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class subBayar extends Model {
    static get table() {
        return 'sub_bayar'
    }
    static get primaryKey() {
        return 'id_sub'
    }

    static get createdAtColumn() {
        return 'dibuat_tgl'
    }

    static get updatedAtColumn() {
        return 'diubah_tgl'
    }

    
}

module.exports = subBayar
