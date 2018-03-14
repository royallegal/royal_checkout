let mix = require('laravel-mix');

// MIX - Don't process relative stylesheet url()'s.
mix.options({
    processCssUrls: false
});

// MIX - Process SCSS
mix.sass('dev/scss/royal-checkout-admin.scss', 'admin/css/');
mix.sass('dev/scss/royal-checkout-public.scss', 'public/css/');

// MIX - Copy Files
mix.copy('node_modules/select2/dist/js/select2.full.min.js', 'admin/js/select2.full.min.js');
mix.copy('node_modules/materialize-css/dist/js/materialize.min.js', 'admin/js/materialize.min.js');
mix.copy('dev/css/select2-materialize.css', 'admin/css/select2-materialize.css');
mix.copy('node_modules/sweetalert2/dist/sweetalert2.min.js', 'admin/js/sweetalert2.min.js');
mix.copy('node_modules/sweetalert2/dist/sweetalert2.min.css', 'admin/css/sweetalert2.min.css');
mix.copy('node_modules/moment/min/moment.min.js', 'admin/js/moment.min.js');