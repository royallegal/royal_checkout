<?php

/**
 * The file that is responsible for handling products.
 *
 * @link       http://royallegalsolutions.com/
 * @since      1.0.0
 *
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/includes
 */

/**
 * The products plugin class.
 *
 * @since      1.0.0
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/includes
 * @author     Royal Legal Solutions <support@royallegalsolutions.com>
 */
class Royal_Checkout_Products {

    /**
     * Get products.
     *
     * @since      1.0.0
     * @version    1.0.0
     * @param      string      $search_string
     * @return     array|mixed $data
     */
    public static function get_products( $search_string ) {

        $search_string = esc_attr( trim( $search_string ) );

        $data = new WP_Query([
            'post_type'      => 'product',
            'posts_per_page' => -1,
            's'              => $search_string
        ]);

        return $data;

    }

    /**
     * Get product.
     *
     * @since     1.0.0
     * @version   1.0.0
     * @param     int   $product_id
     * @return    array $data
     */
    public static function get_product( $product_id ) {

        $product = wc_get_product( $product_id );

        $data = [];

        $product_name  = $product->get_name();
        $product_price = $product->get_price();
        $product_type  = $product->get_type();
        $product_qty_min = $product->get_min_purchase_quantity();
        $product_qty_max = $product->get_max_purchase_quantity();

        $data['id'] = $product_id;

        if ( isset( $product_name ) && ! empty( $product_name ) ) {

            $data['name'] = $product_name;

        }

        if ( isset( $product_price ) && ! empty( $product_price ) ) {

            $data['price'] = $product_price;

        }

        if ( isset( $product_type ) && ! empty( $product_type ) ) {

            $data['type'] = $product_type;

        }

        $data['qty_min'] = $product_qty_min;
        $data['qty_max'] = $product_qty_max;

        if ( isset( $product_type ) && ! empty( $product_type ) && $product_type === 'variable' || isset( $product_type ) && ! empty( $product_type ) && $product_type === 'variable-subscription' ) {

            $data['variables'] = [];
            $variations = $product->get_available_variations();

            foreach ( $variations as $variation ) {

                if ( $variation['variation_is_active'] === true && $variation['variation_is_visible'] === true ) {

                    $variation_name = '';

                    foreach ( $variation['attributes'] as $key => $value ) {

                        reset( $variation['attributes'] );
                        if ( $key === key( $variation['attributes'] ) ) {

                            $variation_name .= $value;

                        } else {

                            $variation_name .= ' | ' . $value;

                        }

                    }

                    $data['variables'][ $variation['variation_id'] ] = [
                        'name'  => $variation_name,
                        'price' => $variation['display_price']
                    ];

                }

            }

        }

        return $data;

    }

}