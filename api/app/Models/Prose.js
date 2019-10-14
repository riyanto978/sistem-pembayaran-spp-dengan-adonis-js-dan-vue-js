'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Prose extends Model {
    static get table() {
        return 'proses'
    }
    static get primaryKey() {
        return 'id_proses'
    }
}

module.exports = Prose
