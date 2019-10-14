'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Reguler extends Model {
    static get table() {
        return 'reguler'
    }
    static get primaryKey() {
        return 'id_laporan'
    }

    static get createdAtColumn(){
        return null
    }
    
    static get updatedAtColumn(){
        return null
    }

    
}

module.exports = Reguler
