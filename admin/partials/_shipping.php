<div class="row" id="shipping_form">
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
    <div class="col s6">
        <div class="input-field">
            <label for="rc-order-shipping-postcode"><?php esc_html_e( 'ZIP Code', 'royal-checkout' ); ?></label>
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