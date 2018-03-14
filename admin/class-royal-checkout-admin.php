<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://royallegalsolutions.com/
 * @since      1.0.0
 *
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Royal_Checkout
 * @subpackage Royal_Checkout/admin
 * @author     Royal Legal Solutions <support@royallegalsolutions.com>
 */
class Royal_Checkout_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->users = new Royal_Checkout_Users();
		$this->products = new Royal_Checkout_Products();
		$this->gump = new GUMP();

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
     * @version  1.0.0
	 */
	public function enqueue_styles( $hook ) {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Royal_Checkout_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Royal_Checkout_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if ( $hook !== 'woocommerce_page_rc-new-order' ) {

		    return;

        }

        wp_enqueue_style( $this->plugin_name . '-material-icons', '//fonts.googleapis.com/icon?family=Material+Icons', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/royal-checkout-admin.css', array(), $this->version, 'all' );
        wp_enqueue_style( $this->plugin_name . '-materialize-select2', plugin_dir_url( __FILE__ ) . 'css/select2-materialize.css', array(), '1.0.0', 'all' );
        wp_enqueue_style( $this->plugin_name . '-sweetalert2', plugin_dir_url( __FILE__ ) . 'css/sweetalert2.min.css', array(), '7.15.1', 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
     * @version  1.0.0
	 */
	public function enqueue_scripts( $hook ) {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Royal_Checkout_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Royal_Checkout_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

        if ( $hook !== 'woocommerce_page_rc-new-order' ) {

            return;

        }

        wp_enqueue_script( $this->plugin_name . '-select2', plugin_dir_url( __FILE__ ) . 'js/select2.full.min.js', array( 'jquery' ), '4.0.6-rc.1', true );
        wp_enqueue_script( $this->plugin_name . '-materialize', plugin_dir_url( __FILE__ ) . 'js/materialize.min.js', array( 'jquery' ), '0.100.2', true );
        wp_enqueue_script( $this->plugin_name . '-sweetalert2', plugin_dir_url( __FILE__ ) . 'js/sweetalert2.min.js', array( 'jquery' ), '7.15.1', true );
        wp_enqueue_script( $this->plugin_name . '-moment', plugin_dir_url( __FILE__ ) . 'js/moment.min.js', array( 'jquery' ), '2.21.0', true );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/royal-checkout-admin.js', array( 'jquery' ), $this->version, true );

	}

	/**
     * Register necessary admin pages.
     *
     * @since    1.0.0
     * @version  1.0.0
     */
	public function register_admin_pages() {

	    // Create a new order submenu page for administrators under WooCommerce.
        add_submenu_page(
            'woocommerce',
            esc_html__( 'Add RC Order', 'royal-checkout' ),
            esc_html__( 'Add RC Order', 'royal-checkout' ),
            'manage_options',
            'rc-new-order',
            [ $this, 'display_new_order_page' ]
        );

    }

    /**
     * Display our New Order page.
     *
     * @since    1.0.0
     * @version  1.0.0
     */
    public function display_new_order_page() {

        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/partials/royal-checkout-admin-new-order-display.php';

    }

    /**
     * AJAX : Search for a User
     *
     * @since    1.0.0
     * @version  1.0.0
     */
    public function rc_ajax_get_user() {

        $data = $this->gump->sanitize( $_POST );

        $this->gump->validation_rules([
            'email' => 'required|valid_email'
        ]);

        $this->gump->filter_rules([
            'email' => 'trim|sanitize_email'
        ]);

        $data = $this->gump->run($data);

        $data = $this->users->get_user( $data['email'] );

        wp_send_json( $data );

    }

    /**
     * AJAX : Search for Product
     *
     * @since    1.0.0
     * @version  1.0.0
     */
    public function rc_ajax_get_products() {

        $data = $this->gump->sanitize( $_POST );

        $this->gump->validation_rules([
            'search' => 'required|alpha_numeric|max_len,30|min_len,3'
        ]);

        $this->gump->filter_rules([
            'search' => 'trim'
        ]);

        $data = $this->gump->run( $data );

        $data = $this->products->get_products( $data['search'] );

        wp_send_json_success( $data );

    }

    /**
     * AJAX : Search for a Product
     *
     * @since    1.0.0
     * @version  1.0.0
     */
    public function rc_ajax_get_product() {

        $data = $this->gump->sanitize( $_POST );

        $this->gump->validation_rules([
            'id' => 'required|integer'
        ]);

        $this->gump->filter_rules([
            'id' => 'trim|sanitize_numbers'
        ]);

        $data = $this->gump->run( $data );

        $data = $this->products->get_product( $data['id'] );

        wp_send_json( $data );

    }

    /**
     * AJAX : Add products to the cart.
     *
     * Creates an order, adds products to that order and sets correct total for that order.
     * If payments are monthly or custom, it will schedule one time events (crons) to create those orders as well.
     *
     * @since    1.0.0
     * @version  1.0.0
     */
    public function rc_ajax_add_to_cart() {

        // Get the data from ajax.
        $products        = $_POST['products'];
        $payments        = $_POST['payments'];
        $payments_option = $_POST['payment_option'];
        $user            = $_POST['user'];

        // Check if user exists.
        $user_exists = email_exists( $user['email'] );
        if ( $user_exists ) {

            $user_id = $user_exists;

        } else {

            $user_password = wp_generate_password();
            $username      = strstr( $user['email'], '@', true );

            $user_data = [
                'user_login' => $username,
                'user_pass'  => $user_password,
                'user_email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name'  => $user['last_name']
            ];

            $user_id = wp_insert_user( $user_data );

            if ( is_wp_error( $user_id ) ) {

                $data['error'] = true;
                wp_send_json( $data );

            }

        }

        // Create new order.
        $order = new WC_Order();
        $order->set_customer_id( $user_id );

        $count = 0;
        // Add products to the order.
        foreach ( $products as $product ) {

            // Fixes an issue with subtotal and total if multiple qty.
            if ( $product['qty'] > 1 ) {
                $product['price'] = $product['qty'] * $product['price'];
            }

            if ( isset( $product['options'] ) && ! empty( $product['options'] ) ) {

                $order->add_product( wc_get_product( $product['id'] ), $product['qty'], [ 'variation_id' => $product['options'], 'subtotal' => $product['price'], 'total' => $product['price'] ] );

            } else {

                $order->add_product( wc_get_product( $product['id'] ), $product['qty'], [ 'subtotal' => $product['price'], 'total' => $product['price'] ] );

            }

            $count++;

        }

        // Check if payment full or some other (monthly, custom).
        if ( $payments_option === 'full' ) {

            $order->calculate_totals();

        } else {

            // Remove all subscription and variable subscription products since they are processed in the first order only.
            $removeTypes = [ 'subscription', 'variable-subscription' ];
            $products_after_removal = array_filter( $products, function($v) use ( $removeTypes ) {

                return ! in_array( $v['type'], $removeTypes );

            });

            // Process All Payments
            foreach ( $payments['orders'] as $payment ) {

                // If first order, just set the total.
                if ( $payment === reset( $payments['orders'] ) ) {

                    $order->set_total( $payment['order_price'] );

                } else {

                    // Get the order date and append 00:00:00 time to it.
                    $next_order_date = $payment['order_date'] . '00:00:00';

                    // Convert string to time.
                    $schedule_at = strtotime( $next_order_date );

                    // Create args array that will hold all of our products and order price.
                    $args = [
                        'products' => $products_after_removal,
                        'order'    => [
                            'order_price' => $payment['order_price']
                        ],
                        'user'     => $user
                    ];

                    // Schedule a single event, cron.
                    wp_schedule_single_event( $schedule_at, 'create_new_order', [ $args ] );

                }

            }
        }

        $data = [];

        if ( $count > 0 ) {

            $order->save();

            $data['error'] = false;
            $data['count'] = $count;

        } else {

            $data['error'] = true;

        }

        wp_send_json( $data );

    }

    /**
     * Creates new order via cron.
     *
     * @param $args
     * @throws WC_Data_Exception
     *
     * @since    1.0.0
     * @version  1.0.0
     */
    public function create_new_order( $args ) {

        if ( $args ) {

            $order = new WC_Order();

            foreach ( $args['products'] as $product ) {

                if ( $product['qty'] > 1 ) {
                    $product['price'] = $product['qty'] * $product['price'];
                }

                if ( isset( $product['options'] ) && ! empty( $product['options'] ) ) {

                    $order->add_product( wc_get_product( $product['id'] ), $product['qty'], [ 'variation_id' => $product['options'], 'subtotal' => $product['price'], 'total' => $product['price'] ] );

                } else {

                    $order->add_product( wc_get_product( $product['id'] ), $product['qty'], [ 'subtotal' => $product['price'], 'total' => $product['price'] ] );

                }

            }

            $order->set_total( $args['order']['order_price'] );
            $order->save();

        }

    }

}
