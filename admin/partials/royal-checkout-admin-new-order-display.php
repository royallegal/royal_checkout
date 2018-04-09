<div class="wrap" style="padding-top: 20px; padding-bottom: 20px;">
    <input type="hidden" id="payment-method" name="payment-method" value="1">
    <input type="hidden" id="cart-total" name="cart-total" value="0">
    <input type="hidden" id="is-first-payment-defined" name="is-first-payment-defined" value="false">
    <input type="hidden" id="is-first-payment-defined-value" name="is-first-payment-defined-value" value="0">
    <div class="row">
        <div class="col s12">
            <div id="rc-order-customer-wrapper">
                <div class="row">
                    <div class="col s12">
                        <div class="input-field input-field-custom">
                            <label for="rc-order-customer-email"><?php esc_html_e( 'Email', 'royal-checkout' ); ?></label>
                            <select name="rc-order-customer-email" id="rc-order-customer-email">
                                <?php
                                    echo '<option></option>';
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
                <div class="row">
                    <div class="col s12">
                        <button class="waves-effect waves-light btn show-billing"><?php esc_html_e( 'Show Billing / Shipping', 'royal-checkout' ); ?></button>
                    </div>
                </div>
                <div class="row billing-info">
                    <div class="col s12">
                        <ul class="tabs">
                            <li class="tab col s6">
                                <a href="#tab-billing"><?php esc_html_e( 'Billing', 'royal-checkout' ); ?></a>
                            </li>
                            <li class="tab col s6">
                                <a href="#tab-shipping"><?php esc_html_e( 'Shipping', 'royal-checkout' ); ?></a>
                            </li>
                        </ul>
                    </div>
                    <div id="tab-billing" class="col s12">
                        <div class="row">
                            <div class="col s6">
                                <div class="input-field input-field-custom">
                                    <label for="rc-order-billing-country"><?php esc_html_e( 'Country', 'royal-checkout' ); ?></label>
                                    <select name="rc-order-billing-country" id="rc-order-billing-country">
                                        <option value="CA"><?php esc_html_e( 'Canada', 'royal-checkout' ); ?></option>
                                        <option value="US" selected><?php esc_html_e( 'United States (US)', 'royal-checkout' ); ?></option>
                                    </select>
                                </div>
                            </div>
                            <div class="col s6">
                                <div class="input-field input-field-custom">
                                    <label for="rc-order-billing-state"><?php esc_html_e( 'State', 'royal-checkout' ); ?></label>
                                    <select name="rc-order-billing-state" id="rc-order-billing-state">
                                        <?php foreach ( get_states( 'US' ) as $key => $value ) : ?>
                                            <option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $value ); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-billing-city"><?php esc_html_e( 'Town / City', 'royal-checkout' ); ?></label>
                                    <input type="text" id="rc-order-billing-city" name="rc-order-billing-city">
                                </div>
                            </div>
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-billing-address"><?php esc_html_e( 'Street address', 'royal-checkout' ); ?></label>
                                    <input type="text" id="rc-order-billing-address" name="rc-order-billing-address">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-billing-postcode"><?php esc_html_e( 'ZIP', 'royal-checkout' ); ?></label>
                                    <input type="text" id="rc-order-billing-postcode" name="rc-order-billing-postcode">
                                </div>
                            </div>
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-billing-phone"><?php esc_html_e( 'Phone', 'royal-checkout' ); ?></label>
                                    <input type="tel" id="rc-order-billing-phone" name="rc-order-billing-phone">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tab-shipping" class="col s12">
                        <div class="row">
                            <div class="col s6">
                                <div class="input-field input-field-custom">
                                    <label for="rc-order-shipping-country"><?php esc_html_e( 'Country', 'royal-checkout' ); ?></label>
                                    <select name="rc-order-shipping-country" id="rc-order-shipping-country">
                                        <option value="CA"><?php esc_html_e( 'Canada', 'royal-checkout' ); ?></option>
                                        <option value="US" selected><?php esc_html_e( 'United States (US)', 'royal-checkout' ); ?></option>
                                    </select>
                                </div>
                            </div>
                            <div class="col s6">
                                <div class="input-field input-field-custom">
                                    <label for="rc-order-shipping-state"><?php esc_html_e( 'State', 'royal-checkout' ); ?></label>
                                    <select name="rc-order-shipping-state" id="rc-order-shipping-state">
                                        <?php foreach ( get_states( 'US' ) as $key => $value ) : ?>
                                            <option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $value ); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-shipping-city"><?php esc_html_e( 'Town / City', 'royal-checkout' ); ?></label>
                                    <input type="text" id="rc-order-shipping-city" name="rc-order-shipping-city">
                                </div>
                            </div>
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-shipping-address"><?php esc_html_e( 'Street address', 'royal-checkout' ); ?></label>
                                    <input type="text" id="rc-order-shipping-address" name="rc-order-shipping-address">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-shipping-postcode"><?php esc_html_e( 'ZIP', 'royal-checkout' ); ?></label>
                                    <input type="text" id="rc-order-shipping-postcode" name="rc-order-shipping-postcode">
                                </div>
                            </div>
                            <div class="col s6">
                                <div class="input-field">
                                    <label for="rc-order-shipping-phone"><?php esc_html_e( 'Phone', 'royal-checkout' ); ?></label>
                                    <input type="tel" id="rc-order-shipping-phone" name="rc-order-shipping-phone">
                                </div>
                            </div>
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
                <div class="col s12 hide">
                    <table id="rc-order-payments-dates" class="striped responsive-table">
                        <thead>
                        <tr>
                            <th><?php esc_html_e( 'Date', 'royal-checkout' ); ?></th>
                            <th><?php esc_html_e( 'Amount', 'royal-checkout' ); ?></th>
                            <th></th>
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
                    <button class="waves-effect waves-light btn add-order"><?php esc_html_e( 'Add Order', 'royal-checkout' ); ?></button>
                    <button class="waves-effect waves-light btn deep-purple darken-4 add-payment"><?php esc_html_e( 'Add Payment', 'royal-checkout' ); ?></button>
                </div>
            </div>
        </div>
    </div>
</div>