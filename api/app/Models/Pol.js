'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pol extends Model {
    static get table() {
        return 'pol'
    }
    static get primaryKey() {
        return 'id_pol'
    }

    
}

module.exports = Pol
