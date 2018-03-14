<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://royallegalsolutions.com/
 * @since             1.0.0
 * @package           Royal_Checkout
 *
 * @wordpress-plugin
 * Plugin Name:       Royal Checkout
 * Plugin URI:        http://royallegalsolutions.com/
 * Description:       Custom checkout interface.
 * Version:           1.0.0
 * Author:            Royal Legal Solutions
 * Author URI:        http://royallegalsolutions.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       royal-checkout
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PLUGIN_NAME_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-royal-checkout-activator.php
 */
function activate_royal_checkout() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-royal-checkout-activator.php';
	Royal_Checkout_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-royal-checkout-deactivator.php
 */
function deactivate_royal_checkout() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-royal-checkout-deactivator.php';
	Royal_Checkout_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_royal_checkout' );
register_deactivation_hook( __FILE__, 'deactivate_royal_checkout' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-royal-checkout.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_royal_checkout() {

	$plugin = new Royal_Checkout();
	$plugin->run();

}
run_royal_checkout();
