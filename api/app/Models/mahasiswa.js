'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mahasiswa extends Model {
    static get table() {
        return 'mahasiswa'
    }
    static get primaryKey() {
        return 'id_mahasiswa'
    }

    static get createdAtColumn() {
        return 'dibuat_tgl'
    }

    static get updatedAtColumn() {
        return 'diubah_tgl'
    }

    
}

module.exports = Mahasiswa
