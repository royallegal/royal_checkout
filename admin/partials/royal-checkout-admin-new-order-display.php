<div class="wrap" style="padding-top: 20px; padding-bottom: 20px;">
    <div class="row">
        <div class="col s12">
            <div id="rc-order-customer-wrapper">
                <div class="row">
                    <div class="col s12">
                        <div class="input-field input-field-custom">
                            <label for="rc-order-customer-email"><?php esc_html_e( 'Email', 'royal-checkout' ); ?></label>
                            <select name="rc-order-customer-email" id="rc-order-customer-email">
                                <?php
                                    $users = $this->users->get_users();
                                    echo '<option></option>';
                                    foreach ( $users as $user ) {

                                        echo '<option value="' . esc_attr( $user[0] ) . '" data-user-id="' . esc_attr( $user[3] ) . '">' . esc_html( $user[0] ) . '</option>';

                                    }
                                ?>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="input-field">
                            <label for="rc-order-customer-first-name"><?php esc_html_e( 'First Name', 'royal-checkout' ); ?></label>
                            <input type="text" id="rc-order-customer-first-name" name="rc-order-customer-first-name">
                        </div>
                    </div>
                    <div class="col s6">
                        <div class="input-field">
                            <label for="rc-order-customer-last-name"><?php esc_html_e( 'Last Name', 'royal-checkout' ); ?></label>
                            <input type="text" id="rc-order-customer-last-name" name="rc-order-customer-last-name">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="input-field input-field-custom col s12">
                    <label for="rc-order-product"><?php esc_html_e( 'Choose Products', 'royal-checkout' ); ?></label>
                    <select name="rc-order-product" id="rc-order-product" class="browser-default" style="width: 100%;"></select>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <table id="rc-order-products" class="striped responsive-table hide">
                        <thead>
                            <tr>
                                <th></th>
                                <th><?php esc_html_e( 'Product', 'royal-checkout' ); ?></th>
                                <th><?php esc_html_e( 'Options', 'royal-checkout' ); ?></th>
                                <th><?php esc_html_e( 'Price', 'royal-checkout' ); ?></th>
                                <th><?php esc_html_e( 'Quantity', 'royal-checkout' ); ?></th>
                                <th><?php esc_html_e( 'Total', 'royal-checkout' ); ?></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <div class="input-field input-field-custom">
                        <label for="rc-order-payment-type">Payment Details</label>
                        <select name="rc-order-payment-type" id="rc-order-payment-type">
                            <option value="0" selected><?php esc_html_e( 'In Full', 'royal-checkout' ); ?></option>
                            <option value="1"><?php esc_html_e( 'Monthly', 'royal-checkout' ); ?></option>
                            <option value="2"><?php esc_html_e( 'Custom', 'royal-checkout' ) ?></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12 hide">
                    <table id="rc-order-payments-dates" class="striped responsive-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th><?php esc_html_e( 'Date', 'royal-checkout' ); ?></th>
                            <th><?php esc_html_e( 'Amount', 'royal-checkout' ); ?></th>
                        </tr>
                        </thead>
                        <tbody style="width: 100%;">

                        </tbody>
                    </table>
                    <button class="btn-floating btn-large waves-effect waves-light red add-payment-date hide"><i class="material-icons">add</i></button>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <button class="waves-effect waves-light btn calc">Calc</button>
                </div>
            </div>
        </div>
    </div>
</div>