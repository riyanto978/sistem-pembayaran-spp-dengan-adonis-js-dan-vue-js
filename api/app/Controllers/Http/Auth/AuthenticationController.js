'use strict'

const User = use('App/Models/User')
const Helpers = use('Helpers')

class AuthenticationController {
    async register({ request, auth, response }) {
        const userData = request.only(['name', 'username', 'password', 'foto', 'level'])

        try {
            var timestamp = new Date().getUTCMilliseconds();
            const profilePic = request.file('foto', {
                types: ['image'],
                size: '2mb'
            })

            // console.log(profilePic._subtype)

            await profilePic.move(Helpers.publicPath('foto'), {

                name: userData.name + timestamp  + profilePic.clientName,
                overwrite: true
            })

            const user = new User()
            user.username = request.input('username')
            user.name = request.input('name')
            user.password = request.input('password')
            user.level = request.input('level')
            user.foto = userData.name + timestamp  + profilePic.clientName
            await user.save()

            const token = await auth.generate(user)
            return response.json({
                status: 'success',
                data: token
            })
        } catch (error) {
            return response.status(400).json({
                status: 'error',
                message: 'There was a problem creating the user, please try again later.'
            })
        }
    }

    async login({ request, auth, response }) {
        const { username, password } = request.only(['username', 'password'])

        try {
            const token = await auth.attempt(username, password)
            let user = await User.findBy('username', username)
            return response.json({
                user: user,
                token: token
            })
        } catch (error) {
            console.log(error)
            response.status(400).json({
                status: 'error',
                message: 'Invalid username/password.'
            })
        }
    }

    async me({ auth, response }) {
        console.log("hi")
        return response.json({
            status: 'success',
            data: auth.user
        })
    }

    async all({ response, params }) {
        var cari = params.cari
        if (cari == 'null') {
            var search = ''
        } else {
            var search = cari
        }

        const users = await User.query().where('username', 'LIKE', '%' + search + '%').orWhere('name', 'LIKE', '%' + search + '%').paginate(params.page, 5)
        return response.json({
            status: 'success',
            data: users
        })
    }

    async delete({ params, request, response }) {
        const user = await User.find(params.id)
        await user.delete()
    }

    async update({ params, request, response }) {

        const user = await User.find(params.id)
        if (request.file('foto') != undefined) {
            var timestamp = new Date().getUTCMilliseconds();
            const profilePic = request.file('foto', {
                types: ['image'],
                size: '2mb'
            })

            await profilePic.move(Helpers.publicPath('foto'), {
                name: request.input('name') + timestamp  + profilePic.clientName,
                overwrite: true
            })

            user.foto = request.input('name') + timestamp  + profilePic.clientName
        }

        user.username = request.input('username')
        user.name = request.input('name')
        if (request.input('password') != 'undefined') {
            user.password = request.input('password')
        }

        if (request.input('level') != null) {
            user.level = request.input('level')
        }
        
        await user.save()

        return response.json({
            status: 'success',
            data: user
        })
    }

}

module.exports = AuthenticationController