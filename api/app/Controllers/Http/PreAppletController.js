'use strict'

const Pre = use('App/Models/PreApplet')
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with preapplets
 */
class PreAppletController {
  /**
   * Show a list of all preapplets.
   * GET preapplets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {

  }

  /**
   * Render a form to be used for creating a new preapplet.
   * GET preapplets/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {

  }

  /**
   * Create/save a new preapplet.
   * POST preapplets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const PreApplet = new Pre()
    PreApplet.id_pol = request.input('id_pol')
    PreApplet.operator = request.input('operator')
    PreApplet.line = request.input('line')
    PreApplet.shift = request.input('shift')
    PreApplet.isi = request.input('isi')
    PreApplet.status = 1
    PreApplet.tip = request.input('tipe_chip')
    await PreApplet.save()

    const data = await Database
      .raw("SELECT pre_applet.tip,pre_applet.line,pre_applet.id_pre,pol.kode,pol.nama,pre_applet.created_at FROM pre_applet INNER JOIN pol on pre_applet.id_pol = pol.id_pol where operator = ?  and pre_applet.status=1", [PreApplet.operator])


    return response.json({
      status: 'success',
      data: data[0]
    })
  }

  /**
   * Display a single preapplet.
   * GET preapplets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing preapplet.
   * GET preapplets/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update preapplet details.
   * PUT or PATCH preapplets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const pre = await Pre.find(params.id)
      pre.status = 2
      await pre.save()

      return response.json({
        status: 'success',
        data: pre
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem updating the Pol, please try again later.'
      })
    }
  }

  /**
   * Delete a preapplet with id.
   * DELETE preapplets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const pre = await Pre.find(params.id)
    await pre.delete()

    return response.json({
      status: 'success',
    })
  }

  async lapSementara({ params, request, response }) {
    const data = await Database
      .raw("SELECT pre_applet.tip,pre_applet.line,pre_applet.id_pre,pol.kode,pol.nama,pre_applet.created_at FROM pre_applet INNER JOIN pol on pre_applet.id_pol = pol.id_pol where operator = ?  and pre_applet.status=1", [params.operator])


    return response.json({
      status: 'success',
      data: data[0]
    })
  }

  async laporan({ params, request, response }) {

    const data = await Database
      .raw("SELECT pre_applet.isi as jumlah,pre_applet.shift,pre_applet.dead,pre_applet.error,pre_applet.lemah,pre_applet.line,pre_applet.id_pre,pol.kode,pol.nama,pre_applet.created_at,pre_applet.updated_at,pre_applet.operator FROM `pre_applet` INNER JOIN pol on pre_applet.id_pol = pol.id_pol where operator=? and date(pre_applet.created_at) = ? and pre_applet.status<>1", [params.operator, params.tanggal])


    return response.json({
      status: 'success',
      data: data[0]
    })
  }

  async tanggal({ params, request, response }) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' + dd
  }

  async reject({ request, response }) {


    if (request.input('column') == 'dead') {
      var query = "update pre_applet set dead = ? where id_pre = ?"
    } else if (request.input('column') == 'error'){
      var query = "update pre_applet set error = ? where id_pre = ?"
    } else if (request.input('column') == 'lemah') {
      var query = "update pre_applet set lemah = ? where id_pre = ?"
    }

    const data = await Database
      .raw(query, [ request.input('value'), request.input('id_pre')])

    return response.json({
      status: 'success',
      data: data[0]
    })

  }
}

module.exports = PreAppletController
