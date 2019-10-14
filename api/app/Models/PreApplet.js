'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PreApplet extends Model {
    static get table() {
        return 'pre_applet'
    }

    static get primaryKey() {
        return 'id_pre'
    }

    

}

module.exports = PreApplet
