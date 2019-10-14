'use strict'
const Database = use('Database')
const Proses = use('App/Models/Prose')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with proses
 */
class ProseController {
  /**
   * Show a list of all proses.
   * GET proses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    return response.json({
      data: await Proses.all()
    })
  }


  /**
   * Render a form to be used for creating a new prose.
   * GET proses/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new prose.
   * POST proses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const proses = new Proses()
    proses.nama_proses = request.input('nama_proses')
    proses.group_laporan = request.input('group_laporan')
    proses.tipe = request.input('tipe')
    await proses.save()

    return response.json({proses : proses})
  }

  /**
   * Display a single prose.
   * GET proses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing prose.
   * GET proses/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update prose details.
   * PUT or PATCH proses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const proses = await Proses.find(params.id)
      proses.nama_proses = request.input('nama_proses')
      proses.group_laporan = request.input('group_laporan')
      proses.tipe = request.input('tipe')
      await proses.save()

      return response.json({        
        proses: proses
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem updating the Proses, please try again later.'
      })
    }
  }

  /**
   * Delete a prose with id.
   * DELETE proses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const proses = await Proses.find(params.id)
    await proses.delete()
  }
}

module.exports = ProseController
