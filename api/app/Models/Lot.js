'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Lot extends Model {
    static get table() {
        return 'lot'
    }
    static get primaryKey() {
        return 'id_lot'
    }
}

module.exports = Lot
