'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KuitansiSchema extends Schema {
  up () {
    this.create('kuitansi', (table) => {
      table.increments('id_kuitansi', 10)
      table.string('nomor_kuitansi', 30).notNullable()
      table.integer('id_mahasiswa', 10).notNullable()
      table.string('guna_pembayaran', 20).notNullable()
      table.integer('total', 100).notNullable()
      table.integer('jumlah_tagihan', 100).notNullable()
      table.integer('jumlah_bayar', 100).notNullable()
      table.string('petugas', 50).notNullable()
      table.timestamp('dibuat_tgl')
      table.timestamp('diubah_tgl')
    })
  }

  down () {
    this.drop('kuitansi')
  }
}

module.exports = KuitansiSchema
