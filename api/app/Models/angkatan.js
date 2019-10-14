'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Angkatan extends Model {
    static get table() {
        return 'angkatan'
    }
    static get primaryKey() {
        return 'id_angkatan'
    }

    static get createdAtColumn() {
        return 'dibuat_tgl'
    }

    static get updatedAtColumn() {
        return 'diubah_tgl'
    }

    
}

module.exports = Angkatan
