'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AngkatanSchema extends Schema {
  up () {
    this.create('angkatan', (table) => {
      table.increments('id_angkatan', 10)
      table.string('nama_angkatan', 50).notNullable().unique()
      table.string('thn_ajaran', 30).notNullable()
      table.string('tgl_mulai', 20).notNullable()
      table.integer('her', 10).notNullable()
      table.integer('penunjang', 10).notNullable()
      table.integer('registrasi', 10).notNullable()
      table.integer('spi', 10).notNullable()
      table.integer('spp', 10).notNullable()
      table.integer('ta', 10).notNullable()
      table.integer('wisuda', 10).notNullable()
      table.string('status', 15).notNullable()
      table.text('sub_bayar')
      table.timestamp('dibuat_tgl')
      table.timestamp('diubah_tgl')
    })
  }

  down () {
    this.drop('angkatan')
  }
}

module.exports = AngkatanSchema
