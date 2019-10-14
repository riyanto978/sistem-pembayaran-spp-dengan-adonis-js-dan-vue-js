'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MahasiswaSchema extends Schema {
  up () {
    this.create('mahasiswa', (table) => {
      table.increments('id_mahasiswa', 10)
      table.integer('nim', 10).unique()
      table.string('nama_mahasiswa', 50).notNullable()
      table.string('jenis_kelamin', 25).notNullable()
      table.string('alamat', 100).notNullable()
      table.string('agama', 100).notNullable()
      table.string('program_studi', 100).notNullable()
      table.integer('telepon', 13).notNullable()
      table.integer('angkatan', 10).notNullable()
      table.string('kelas', 20).notNullable()
      table.string('foto', 100).notNullable()
      table.timestamp('dibuat_tgl')
      table.timestamp('diubah_tgl')

    })
  }

  down () {
    this.drop('mahasiswa')
  }
}

module.exports = MahasiswaSchema
