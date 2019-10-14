export default function ({ store, redirect }) {
    // Jika user tidak terautentikasi
    if (store.state.auth == null) {
        return redirect('/login')
    }
}