<?php

/**
 * The file that is responsible for handling users.
 *
 * @link       http://royallegalsolutions.com/
 * @since      1.0.0
 *
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/includes
 */

/**
 * The users plugin class.
 *
 * @since      1.0.0
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/includes
 * @author     Royal Legal Solutions <support@royallegalsolutions.com>
 */
class Royal_Checkout_Users {

    /**
     * Get user.
     *
     * @since     1.0.0
     * @version   1.0.0
     * @param     string $user_email
     * @return    array  $data_to_return
     */
    public static function get_user( $user_email ) {

        $data = new WP_User_Query([
            'search'         => $user_email,
            'search_columns' => [
                'user_email'
            ]
        ]);

        $data = $data->get_results();

        $author = get_userdata( $data[0]->ID );

        $data_to_return = [
            'first_name' => $author->first_name,
            'last_name'  => $author->last_name
        ];

        $billing_address    = get_user_meta( $data[0]->ID, 'billing_address_1', true );
        $billing_city       = get_user_meta( $data[0]->ID, 'billing_city', true );
        $billing_state      = get_user_meta( $data[0]->ID, 'billing_state', true );
        $billing_postcode   = get_user_meta( $data[0]->ID, 'billing_postcode', true );
        $billing_country    = get_user_meta( $data[0]->ID, 'billing_country', true );
        $billing_phone      = get_user_meta( $data[0]->ID, 'billing_phone', true );

        $shipping_address    = get_user_meta( $data[0]->ID, 'shipping_address_1', true );
        $shipping_city       = get_user_meta( $data[0]->ID, 'shipping_city', true );
        $shipping_state      = get_user_meta( $data[0]->ID, 'shipping_state', true );
        $shipping_postcode   = get_user_meta( $data[0]->ID, 'shipping_postcode', true );
        $shipping_country    = get_user_meta( $data[0]->ID, 'shipping_country', true );
        $shipping_phone      = get_user_meta( $data[0]->ID, 'shipping_phone', true );

        $data_to_return['billing_address']  = $billing_address;
        $data_to_return['billing_city']     = $billing_city;
        $data_to_return['billing_state']    = $billing_state;
        $data_to_return['billing_postcode'] = $billing_postcode;
        $data_to_return['billing_country']  = $billing_country;
        $data_to_return['billing_phone']    = $billing_phone;

        $data_to_return['shipping_address']  = $shipping_address;
        $data_to_return['shipping_city']     = $shipping_city;
        $data_to_return['shipping_state']    = $shipping_state;
        $data_to_return['shipping_postcode'] = $shipping_postcode;
        $data_to_return['shipping_country']  = $shipping_country;
        $data_to_return['shipping_phone']    = $shipping_phone;

        return $data_to_return;

    }

    /**
     * Get users.
     *
     * @since      1.0.0
     * @version    1.0.0
     * @return     array $data_to_return
     */
    public static function get_users() {

        $data = new WP_User_Query([
            'number'         => 999999,
        ]);

        $data = $data->get_results();

        $data_to_return = [];

        foreach ( $data as $author ) {

            $author_info = get_userdata( $author->ID );

            $data_to_return[$author->ID] = [
                $author->user_email,
                $author_info->first_name,
                $author_info->last_name,
                $author->ID
            ];

        }

        return $data_to_return;

    }

}