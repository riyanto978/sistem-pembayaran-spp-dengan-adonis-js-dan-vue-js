'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable().unique()
      table.string('username', 80).notNullable().unique()      
      table.string('password', 60).notNullable()
      table.timestamp('dibuat_tgl')
      table.timestamp('diubah_tgl')
      table.string('level', 15)
      table.string('foto', 60)
      
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
