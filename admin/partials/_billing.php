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
    <div class="col s6">
        <div class="input-field">
            <label for="rc-order-billing-postcode"><?php esc_html_e( 'ZIP Code', 'royal-checkout' ); ?></label>
            <input type="text" id="rc-order-billing-postcode" name="rc-order-billing-postcode">
        </div>
    </div>
    <div class="col s6">
        <div class="input-field">
            <label for="rc-order-billing-phone"><?php esc_html_e( 'Phone', 'royal-checkout' ); ?></label>
            <input type="tel" id="rc-order-billing-phone" name="rc-order-billing-phone">
        </div>
    </div>
    <div class="col s12">
        <input type="checkbox" id="rc-oder-same-for-shipping" name="rc-oder-same-for-shipping" />
        <label for="rc-oder-same-for-shipping"><strong>Use Billing information for Shipping too</strong></label>
    </div>
</div>