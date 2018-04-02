<div class="row">
	<div class="input-field input-field-custom col s12">
		<label for="rc-order-product"><?php esc_html_e( 'Choose Products', 'royal-checkout' ); ?></label>
		<select name="rc-order-product" id="rc-order-product" class="browser-default" style="width: 100%;"></select>
	</div>
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