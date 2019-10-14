'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubBayarSchema extends Schema {
  up () {
    this.create('sub_bayar', (table) => {
      table.increments('id_sub', 10)
      table.string('kode_sub', 10).notNullable().unique()
      table.string('nama_sub', 100).notNullable()
      table.integer('tagihan', 10).notNullable()
      table.string('status', 20).notNullable()
      table.text('keterangan')
      table.timestamp('dibuat_tgl')
      table.timestamp('diubah_tgl')
    })
  }

  down () {
    this.drop('sub_bayar')
  }
}

module.exports = SubBayarSchema
