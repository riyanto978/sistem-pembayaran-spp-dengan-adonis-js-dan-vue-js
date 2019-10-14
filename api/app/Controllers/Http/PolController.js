'use strict'
const Database = use('Database')
const Pol = use('App/Models/Pol')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with pols
 */
class PolController {
  /**
   * Show a list of all pols.
   * GET pols
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {


    return response.json({
      data: await Pol.query().paginate(1, 2)
    })
  }

  async dataReguler({ request, response, view }) {

    var cari = request.params.cari
    if (cari == 'null') {
      var search = ''
    } else {
      var search = cari
    }

    return response.json({
      data: await Pol.query().where('tipe','reguler').where('kode_pol', 'like', '%' + search + '%').orderBy('kode_pol', 'asc').paginate(request.params.page, 5)
    })
  }

  async resume({ request, response }) {
    
    return response.json({
      data: 
      await Database.table('resume_proses')
      .innerJoin('proses','resume_proses.proses','proses.id_proses')            
      .where('resume_proses.pol', request.params.id_pol)
    })
  }
    
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new pol.
   * POST pols
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const pol = new Pol()
    pol.kode = request.input('kode')
    pol.nama = request.input('nama')
    pol.jmlorder = request.input('jmlorder')
    pol.isi = '500'
    pol.stat = request.input('stat')
    await pol.save()

    return response.json({
      status: 'success',
      data: pol
    })
  }

  /**
   * Display a single pol.
   * GET pols/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing pol.
   * GET pols/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update pol details.
   * PUT or PATCH pols/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const pol = await Pol.find(params.id)
      pol.kode = request.input('kode')
      pol.nama = request.input('nama')
      pol.jmlorder = request.input('jmlorder')
      pol.stat = request.input('stat')
      await pol.save()

      return response.json({
        status: 'success',
        data: pol
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem updating the Pol, please try again later.'
      })
    }
  }

  /**
   * Delete a pol with id.
   * DELETE pols/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const pol = await Pol.find(params.id)
    await pol.delete()
  }

  async tahun({ params, request, response }) {
    var dateO = new Date()
    var year = dateO.getUTCFullYear()

    return year
  }
}

module.exports = PolController
