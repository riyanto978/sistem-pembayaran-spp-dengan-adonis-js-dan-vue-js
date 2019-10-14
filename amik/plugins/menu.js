const Menu = [
    { header: 'Laporan' },
    {
        title: 'Home',
        group: 'laporan',
        icon: 'home',
        name: '/index',
    },
    {
        title: 'Pre Applet',
        group: 'laporan',
        icon: 'chat_bubble',
        name: '/preperso/pre_applet',
        href: 'applet',
    },
    {
        title: 'Applet',
        group: 'laporan',
        icon: 'chat_bubble',
        name: '/preperso/applet',
        href: 'applet',
    },
    {
        title: 'Preperso',
        group: 'widgets',
        icon: 'widgets',
        items: [
            { name: '/preperso/preperso/appletDulu', title: 'applet dahulu' },
            { name: '/preperso/preperso/tanpaApplet', title: 'Tanpa Applet', badge: 'new' },
        ]
    },
    {
        title: 'record',
        group: 'widgets',
        icon: 'widgets',
        items: [
            { name: '/preperso/record/prepersoDulu', title: 'Preperso dahulu' },
            { name: '/preperso/record/tanpaPreperso', title: 'Tanpa Preperso', badge: 'new' },
        ]
    },
    { header: 'Other' },
    { divider: true },
    {
        title: 'Manual',
        group: 'widgets',
        icon: 'widgets',
        items: [
            { name: '/preperso/log/uploadApplet', title: 'Upload Log Applet' },
            { name: '/preperso/log/uploadPreperso', title: 'Upload Log Preperso' },
        ]
    },
    {
        title: 'Track',
        group: 'widgets',
        icon: 'widgets',
        items: [
            { name: '/preperso/track/job', title: 'Track Job' },
            { name: '/preperso/track/sam', title: 'Track Jumlah Sam', badge: 'new' },
        ]
    },
   
];

// reorder menu
Menu.forEach((item) => {
    if (item.items) {
        item.items.sort((x, y) => {
            let textA = x.title.toUpperCase();
            let textB = y.title.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }
});


export default Menu;
