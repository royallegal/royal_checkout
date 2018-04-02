<div class="wrap" style="padding-top: 20px; padding-bottom: 20px;">
    <div class="row">
        <div class="col s12">
            <div id="rc-order-customer-wrapper">
                <div class="row">
                    <div class="col s12">
                        <div class="input-field input-field-custom">
                            <label for="rc-order-customer-email"><?php esc_html_e( 'Find a customer', 'royal-checkout' ); ?></label>
                            <select name="rc-order-customer-email" id="rc-order-customer-email">
                                <?php
                                    $users = $this->users->get_users();
                                    echo '<option></option>';
                                    foreach ( $users as $user ) {

                                        echo '<option value="' . esc_attr( $user[0] ) . '" data-user-id="' . esc_attr( $user[3] ) . '">' . esc_html( $user[1] ) . " " . esc_html( $user[2] ) . " (" . esc_html( $user[0] ) . ')</option>';

                                    }
                                ?>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s6">
                        <div class="input-field">
                            <i class="material-icons prefix">account_circle</i>
                            <label class="validate" for="rc-order-customer-first-name"><?php esc_html_e( 'First Name', 'royal-checkout' ); ?></label>
                            <input type="text" id="rc-order-customer-first-name" name="rc-order-customer-first-name">
                        </div>
                    </div>
                    <div class="input-field col s6">
                        <div class="input-field">
                            <i class="material-icons prefix">account_circle</i>
                            <label class="validate" for="rc-order-customer-last-name"><?php esc_html_e( 'Last Name', 'royal-checkout' ); ?></label>
                            <input type="text" id="rc-order-customer-last-name" name="rc-order-customer-last-name">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col s12">
                        <ul class="tabs">
                            <li class="tab col s3"><a href="#show-billing" onclick="$('#show-billing').removeClass('hide');">Billing</a></li>
                            <li class="tab col s3"><a href="#show-shipping" onclick="$('#show-shipping').removeClass('hide');">Shipping</a></li>
                        </ul>
                    </div>
                    <div id="show-billing" class="col s12 hide">
                        <?php include("_billing.php"); ?>
                    </div>
                    <div id="show-shipping" class="col s12 hide">
                        <?php include("_shipping.php"); ?>
                    </div>


                    <div id="products">
                        <?php include("_products.php"); ?>
                    </div>

                </div>

                <?php include("_payment.php"); ?>

            </div>

            <div class="row">
                <div class="col s12">
                    <button class="waves-effect waves-light btn calc"><i class="material-icons left">add</i> <?php esc_html_e( 'Create Order', 'royal-checkout' ); ?></button>
                    <button id="add-payment" class="waves-effect waves-teal btn-flat"><i class="material-icons left">credit_card</i> <?php esc_html_e( 'Add Payment', 'royal-checkout' ); ?></button>
                </div>
            </div>

        </div>
    </div>
</div>

