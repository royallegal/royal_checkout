<?php

/**
 * Fired during plugin activation
 *
 * @link       http://royallegalsolutions.com/
 * @since      1.0.0
 *
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/includes
 * @author     Royal Legal Solutions <support@royallegalsolutions.com>
 */
class Royal_Checkout_Activator {

    /**
     * Short Description. (use period)
     *
     * Long Description.
     *
     * @since    1.0.0
     */
    public static function activate() {
        // $wpdb is to handle wp database
        global $wpdb;
        // use the correct charset in the db
        $charset_collate = $wpdb->get_charset_collate();
        // sql query
        $sql = NULL;

        $table_name      = $wpdb->prefix . "royalcheckout_payments_plan"; 
        $sql.= "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            customer varchar(255) NOT NULL,
            payment_schedule_date varchar(255) NOT NULL,
            payment_amout varchar(255) NOT NULL,
            payment_remaining varchar(255) NOT NULL,
            is_payed boolean NOT NULL,
            payment_date text,
            last_attempt text,
            number_attemps varchar(255),
            callback text,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        $table_name      = $wpdb->prefix . "royalcheckout_customers"; 
        $sql.= "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            stripe_client_id varchar(255) NOT NULL,
            callback text NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        // if something in the table changes, we can update to the db easly with wp-include upgrade
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        // use dbDelta to create/upgrade the table
        $return = dbDelta( $sql );
        return $return;
    }

}
