'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UbahkuitansiSchema extends Schema {
  up () {
    this.rename('kuitansi','pembayaran')
  }
  
}

module.exports = UbahkuitansiSchema
