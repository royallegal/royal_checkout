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