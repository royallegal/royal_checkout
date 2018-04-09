jQuery(document).ready(function($) {
    'use strict';

    var changed = [];

    // Calculate amount by chunks.
    function chunkize( number, chunk ){

        var result = [];
        while ( number >= chunk ) {

            result.push( Math.trunc( Number( chunk ) ) );
            number = Number( number ) - Number( chunk );

        }
        if ( number ) result.push(Math.trunc( number ) );
        return result;

    }

    // Sum numbers
    function add(a, b) {

        return Number( a ) + Number( b );

    }

    // Sum array
    function sum_array( array ) {

        var result = array.reduce(add, 0);

        return result;

    }

    // Toggle text
    $.fn.extend({
        toggleText: function(a, b) {
            return this.text(this.text() == b ? a : b);
        }
    });

    // Check if in Array
    function isInArray( value, array ) {

        return array.indexOf( value ) > -1;

    }

    // Calculate Total
    function calc_total() {

        var total = 0;

        $('#rc-order-products > tbody > tr').each(function() {
            total = total + Number( $(this).find('.product-total').html() );
        });

        $('#cart-total').attr('value', total);

    }

    // Init Select2 on Country and State
    if ( $('#rc-order-billing-country').length ) {

        $('#rc-order-billing-country, #rc-order-shipping-country').select2();
        $('#rc-order-billing-state, #rc-order-shipping-state').select2();

        // On Country Change - Billing
        $(document).on('select2:select', '#rc-order-billing-country', function(event) {
            var data = event.params.data,
                value = data.id;

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    id: value,
                    action: 'rc_ajax_get_states'
                },
                success: function( response ) {
                    $('#rc-order-billing-state').empty().append( response ).trigger('change');
                },
                error: function( response ) {
                    console.log( response );
                }
            });
        });

        // On Country Change - Shipping
        $(document).on('select2:select', '#rc-order-shipping-country', function(event) {
            var data = event.params.data,
                value = data.id;

            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    id: value,
                    action: 'rc_ajax_get_states'
                },
                success: function( response ) {
                    $('#rc-order-shipping-state').empty().append( response ).trigger('change');
                },
                error: function( response ) {
                    console.log( response );
                }
            });
        });

    }

    // Toggle Billing
    $(document).on('click', '.show-billing', function(event) {
        event.preventDefault();

        $(this).toggleText( 'Show Billing / Shipping', 'Hide Billing / Shipping' );

        $('.billing-info').toggleClass('is-active');

        $('.tabs').tabs();

        $('#rc-order-billing-address, #rc-order-billing-city, #rc-order-billing-postcode, #rc-order-billing-phone').parent().find('label').toggleClass('active');
    });

    // Choose Customer
    if ( $('#rc-order-customer-email').length ) {
        $('#rc-order-customer-email').select2({
          placeholder: 'Find a User',
          ajax: {
            url: ajaxurl,
            dataType: 'JSON',
            type: 'POST',
            cache: true,
            delay: 250,
            data: function(params) {
              return {
                search: params.term,
                action: 'rc_ajax_search_users'
              };
            },
            processResults: function(data) {
              var options = [];

              if ( data ) {
                $.each(data, function(k, v) {
                  options.push({
                    id: v.user_email,
                    text: v.user_email
                  });
                });
              }

              return {
                results: options
              };
            }
          },
          minimumInputLength: 3,
          tags: false,
          allowClear: true
        });

        $('#rc-order-customer-email').on('select2:select', function(event) {
            event.preventDefault();

            var data = event.params.data;

            // If user is selected, fill out first name and last name.
            if ( data.selected === true ) {
                $.ajax({
                    url: ajaxurl,
                    dataType: 'JSON',
                    type: 'POST',
                    data: {
                        email: data.id,
                        action: 'rc_ajax_get_user'
                    },
                    success: function(response) {
                        $('#rc-order-customer-first-name').val( response.first_name );
                        $('#rc-order-customer-last-name').val( response.last_name );
                        $('#rc-order-billing-address').val( response.billing_address );
                        $('#rc-order-billing-city').val( response.billing_city );
                        $('#rc-order-billing-postcode').val( response.billing_postcode );
                        $('#rc-order-billing-phone').val( response.billing_phone );
                        $('#rc-order-billing-country').val( response.billing_country ).trigger('change');

                        $('#rc-order-shipping-address').val( response.shipping_address );
                        $('#rc-order-shipping-city').val( response.shipping_city );
                        $('#rc-order-shipping-postcode').val( response.shipping_postcode );
                        $('#rc-order-shipping-phone').val( response.shipping_phone );
                        $('#rc-order-shipping-country').val( response.shipping_country ).trigger('change');

                        var billing_state = response.billing_state,
                            shipping_state = response.shipping_state;

                        $('#rc-order-customer-first-name, #rc-order-customer-last-name, #rc-order-billing-address, #rc-order-billing-city, #rc-order-billing-postcode, #rc-order-billing-phone').focus();

                        $.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                id: response.billing_country,
                                action: 'rc_ajax_get_states'
                            },
                            success: function( response ) {
                                $('#rc-order-billing-state').empty().append( response ).trigger('change');
                                $('#rc-order-billing-state').val( billing_state ).trigger('change');

                                $('#rc-order-shipping-state').empty().append( response ).trigger('change');
                                $('#rc-order-shipping-state').val( shipping_state ).trigger('change');
                            },
                            error: function( response ) {
                                console.log( response );
                            }
                        });
                    },
                    error: function(response) {
                        console.log(response);
                    }
                });
            }
        });
    }

    // Choose Product
    if ( $('#rc-order-product').length ) {
        $('#rc-order-product').select2({
            ajax: {
                url: ajaxurl,
                dataType: 'JSON',
                type: 'POST',
                cache: false,
                delay: 250,
                data: function(params) {
                    return {
                        search: params.term,
                        action: 'rc_ajax_get_products'
                    };
                },
                processResults: function(data) {
                    var options = [];

                    if ( data ) {
                        if ( data.data ) {
                            if ( data.data.posts ) {
                                $.each(data.data.posts, function(k, v) {
                                    options.push({
                                        id: v.ID,
                                        text: v.post_title
                                    });
                                });
                            }
                        }
                    }

                    return {
                        results: options
                    };
                }
            },
            minimumInputLength: 3,
            tags: false,
            allowClear: true
        });

        // When product is selected, add it to "cart".
        $('#rc-order-product').on('select2:select', function(event) {
            event.preventDefault();

            var data = event.params.data;

            // If product is selected.
            if ( data.selected === true ) {

                var rows = $('#rc-order-products tbody tr').length;

                $.ajax({
                    url: ajaxurl,
                    dataType: 'JSON',
                    type: 'POST',
                    data: {
                        id: data.id,
                        action: 'rc_ajax_get_product'
                    },
                    success: function(response) {
                        // Used to append appropriate class to the "input-field" table row class.
                        var max = '';

                        // Max Value
                        if ( response.qty_max != '-1' ) {

                            max = 'max="' + response.qty_max + '"';

                        }

                        var product_html = '<tr data-product-type="' + response.type + '" data-product-id="' + response.id + '"><td><a href="#" class="remove-product">X</a></td>';
                        product_html += '<td class="product-name">';
                        product_html += '<div class="input-field no-image"><textarea name="product-note[' + rows + ']" placeholder="Add note" class="materialize-textarea"></textarea><label>' + response.name + '</label></div>';
                        product_html += '</td>';
                        product_html += '<td class="product-options">';
                        if ( response.hasOwnProperty( 'variables' ) ) {
                            product_html += '<div class="input-field input-field-custom"><select class="product-options-select" name="product-options[' + rows + ']">';
                            $.each(response.variables, function (key, value) {
                                product_html += '<option value="' + key + '" data-product-variation-price="' + value.price + '">' + value.name + '</option>';
                            });
                            product_html += '</select></div>';
                        }
                        product_html += '</td>';
                        product_html += '<td class="product-price"><div class="input-field"><input type="number" name="product-price[' + rows + ']" value="' + response.price + '" /></div></td>';
                        product_html += '<td class="product-qty"><div class="input-field"><input type="number" name="product-qty[' + rows + ']" min="' + response.qty_min + '" ' + max + ' value="' + response.qty_min + '" /></div></td>';
                        product_html += '<td class="product-total">' + response.price + '</td>';
                        product_html += '</tr>';

                        $('#rc-order-products').removeClass('hide');
                        $('#rc-order-products tbody').append( product_html );

                        // Focus
                        $('#rc-order-products tbody textarea[name="product-note[' + rows + ']"]').focus();

                        $('select.product-options-select').select2({
                            minimumResultsForSearch: Infinity
                        });

                        calc_total();
                    },
                    error: function(response) {
                        console.log(response);
                    }
                });

            }
        });

        // Remove product from the "cart".
        $(document).on('click', '.remove-product', function(event) {
            event.preventDefault();

            $(this).parent().parent().remove();

            // Fix index(es) on other products in the "cart".
            if ( $('#rc-order-products tbody tr').length ) {

                $('#rc-order-products tbody tr').each(function( index ) {
                    $(this).find('input[name^="product-note"]').attr('name', 'product-note[' + index + ']');
                    $(this).find('input[name^="product-options"]').attr('name', 'product-options[' + index + ']');
                    $(this).find('input[name^="product-price"]').attr('name', 'product-price[' + index + ']');
                    $(this).find('input[name^="product-qty"]').attr('name', 'product-qty[' + index + ']');
                });

            }

            calc_total();
        });

        // On product variation select, update price.
        $(document).on('select2:select', 'select.product-options-select', function(event) {
            event.preventDefault();

            var data          = event.params.data,
                price         = data.element.attributes[1].nodeValue,
                parent_row    = $(this).parents( 'tr' ),
                qty           = parent_row.find('.product-qty input').val(),
                price_to_show = price * qty;

            parent_row.find('.product-price input').attr( 'value', price );
            parent_row.find('.product-total').html( price_to_show );

            calc_total();

        });

        // On product quantity change, update total.
        $(document).on('input', '.product-qty input', function(event) {
            event.preventDefault();

            var qty           = $(this).val(),
                parent_row    = $(this).parents( 'tr' ),
                price         = parent_row.find('.product-price input').val(),
                price_to_show = price * qty;

            $(this).attr( 'value', qty );
            parent_row.find('.product-total').html( price_to_show );

            calc_total();
        });

        // On product price change, update total.
        $(document).on('input', '.product-price input', function(event) {
            event.preventDefault();

            var price         = $(this).val(),
                parent_row    = $(this).parents( 'tr' ),
                qty           = parent_row.find('.product-qty input').val(),
                price_to_show = price * qty;

            $(this).attr( 'value', price );
            parent_row.find('.product-total').html( price_to_show );

            calc_total();
        });

        // On Add Payment, open up a modal.
        $(document).on('click', '.add-payment', function(event) {
            event.preventDefault();

            // Check if there are any products in the cart.
            if ( $('#rc-order-products tbody tr').length ) {

                
                // Get all non subscription products.
                var regular_products = 0;
                $('#rc-order-products tbody tr:not([data-product-type*="subscription"])').each(function() {
                    regular_products = Number( regular_products ) + Number( $(this).find('.product-total').html() );
                });

                // Get all subscription products.
                var subscription_products = 0;
                $('#rc-order-products tbody tr[data-product-type*="subscription"]').each(function() {
                    subscription_products = Number( subscription_products ) + Number( $(this).find('.product-total').html() );
                });

                var swal_payments_html = '<div class="input-field">';
                    swal_payments_html += '<input type="number" id="first-payment" name="first-payment">';
                    swal_payments_html += '<label for="first-payment">First Payment</label>';
                    swal_payments_html += '</div>';
                    swal_payments_html += '<div class="input-field">';
                    swal_payments_html += '<input type="number" id="monthly-price" name="monthly-price" step="1">';
                    swal_payments_html += '<label for="monthly-price">Monthly Price</label>';
                    swal_payments_html += '</div>';

                    swal({
                        title: 'Payment Plan',
                        html: swal_payments_html,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        preConfirm: function() {
                            var first_payment  = $('#first-payment').val(),
                                monthly_price  = $('#monthly-price').val(),
                                errors       = '';

                            // Monthly Price is required.
                            if ( ! monthly_price ) {

                                errors += 'Monthly price can\'t be empty.';

                            }

                            // Display Errors
                            if ( errors ) {

                                swal.showValidationError( errors );

                                setTimeout(function() {
                                    swal.resetValidationError();
                                }, 5000);

                            } else {

                                $('#rc-order-payments-dates tbody').empty();

                                var payments = [];

                                if ( first_payment.length ) {

                                    if ( ! isInArray( 0, changed ) ) {

                                        changed.push( 0 );

                                    }

                                    $('#is-first-payment-defined').attr('value', 'true');
                                    $('#is-first-payment-defined-value').attr('value', first_payment);

                                    var first_payment_total = Number( first_payment ) + subscription_products,
                                        rest_total          = regular_products - Number( first_payment );

                                    payments = chunkize( rest_total, monthly_price );
                                    payments.unshift( first_payment_total );

                                } else {

                                    payments = chunkize( regular_products, monthly_price );
                                    payments[0] = Number( payments[0] ) + subscription_products;

                                }

                                // Append Payments
                                var payments_html = '';
                                $.each(payments, function(key, value) {
                                    payments_html += '<tr>';
                                    payments_html += '<td>';
                                    payments_html += '<div class="input-field"><input type="text" class="datepicker payment-date-custom" name="payment-date-custom[' + key + ']"></div>';
                                    payments_html += '</td>';
                                    payments_html += '<td>';
                                    payments_html += '<div class="input-field"><input type="number" class="payment-price-custom" name="payment-price-custom[' + key + ']" value="' + value + '"></div>';
                                    payments_html += '</td>';
                                    payments_html += '<td><a href="#" class="btn-floating btn-large waves-effect waves-light red remove-payment"><i class="material-icons">delete_forever</i></a></td>';
                                    payments_html += '</tr>';
                                });

                                $('#rc-order-payments-dates tbody').append( payments_html );

                                // Initialize every datepicker and set the date.
                                $.each(payments, function(key, value) {

                                    var date = '';

                                    if ( key === 0 ) {

                                        date = moment().format('MM/DD/YYYY');

                                    } else {

                                        date = moment().add(key, 'months').format('MM/DD/YYYY');

                                    }

                                    $('.datepicker[name="payment-date-custom[' + key + ']"]').pickadate({
                                        selectMonths: true,
                                        selectYears: 2,
                                        today: 'Today',
                                        clear: 'Clear',
                                        close: 'Ok',
                                        closeOnSelect: false
                                    });

                                    $('.datepicker[name="payment-date-custom[' + key + ']"]').pickadate('picker').set('select', date, { format: 'mm/dd/yyyy' }).trigger('change');
                                });

                            }
                        }
                    });

                    $('#rc-order-payments-dates').parent().removeClass('hide');

                    $('#payment-method').attr('value', '2');


            } else {

                swal({
                    title: 'Error',
                    type: 'error',
                    text: 'You don\'t have any products added. Please add some products and then you can add payments.'
                });

                return;

            }
        });
    }

    function calculateChangedFieldsTotal() {

        var changed_total = 0;
        $.each( changed, function( key, value ) {

            changed_total = changed_total + Number( $('input[name="payment-price-custom[' + value + ']"]').attr('value') );

        });

        return changed_total;

    }

    $(document).on('input', '.payment-price-custom', function(event) {

        var index = $(this).attr('name'),
            index = index.replace(/\D/g, '');

        if ( ! isInArray( index, changed ) ) {

            changed.push( index );

        }

        var total = $('#cart-total').attr('value'),
            changed_payments  = changed.length,
            total_payments    = $('.payment-price-custom').length;

        var changed_total = calculateChangedFieldsTotal();

        if ( changed_total > total ) {

            swal({
                type: 'error',
                text: 'You have entered a value that would in total exceed the total of the cart.'
            });

            $(this).attr('value', ( Number( changed_total ) - Number( total ) ));

            return;

        }

        var total_to_return = ( Number( total ) - Number( changed_total ) ) / ( Number( total_payments ) - Number( changed_payments ) );

        $('.payment-price-custom').each(function(key, value) {
            var element_name_index = $(this).attr('name').replace(/\D/g, '');
            if ( ! isInArray( element_name_index, changed ) ) {
                $(this).attr('value', total_to_return);
            }
        });
    });

    // Remove payment from the "list".
    $(document).on('click', '.remove-payment', function(event) {
        event.preventDefault();

        $(this).parent().parent().remove();

        var number_of_payments = 0;

        // Fix index(es) on other products in the "cart".
        $('#rc-order-payments-dates > tbody > tr').each(function( index ) {
            $(this).find('input.payment-date-custom').attr('name', 'payment-date-custom[' + index + ']');
            $(this).find('input.payment-price-custom').attr('name', 'payment-price-custom[' + index + ']');

            number_of_payments = number_of_payments + 1;
        });

        if ( number_of_payments === 1 ) {

            $('#rc-order-payments-dates > tbody').empty();
            $('#rc-order-payments-dates').parent().addClass('hide');

            $('#is-first-payment-defined').attr('value', 'false');
            $('#is-first-payment-defined-value').attr('value', '0');
            $('#payment-method').attr('value', '1');

        }

        var payment = 0;

        // Update payments.
        if ( $('#is-first-payment-defined').val() === 'false' ) {

            payment = Number( $('#cart-total').val() ) / number_of_payments;

            $('#rc-order-payments-dates > tbody > tr input.payment-price-custom').attr('value', payment );

        } else {

            payment = ( Number( $('#cart-total').val() ) - Number( $('#is-first-payment-defined-value').val() ) ) / ( number_of_payments - 1 );

            $('#rc-order-payments-dates > tbody > tr input.payment-price-custom').attr('value', payment );
            $('#rc-order-payments-dates > tbody > tr:first-of-type input.payment-price-custom').attr('value', $('#is-first-payment-defined-value').val() );

        }
    });

    $(document).on('click', '.add-payment-date', function(event) {
        event.preventDefault();

        var length = $('#rc-order-payments-dates > tbody > tr').length,
            payments_html = '<tr>';
            payments_html += '<td><a href="#" class="remove-payment">X</a></td>';
            payments_html += '<td>';
            payments_html += '<div class="input-field"><input type="text" class="datepicker payment-date-custom" name="payment-date-custom[' + length + ']"></div>';
            payments_html += '</td>';
            payments_html += '<td>';
            payments_html += '<div class="input-field"><input type="number" class="payment-price-custom" name="payment-price-custom[' + length + ']"></div>';
            payments_html += '</td>';
            payments_html += '</tr>';

        $('#rc-order-payments-dates > tbody').append( payments_html );

        $('#rc-order-payments-dates > tbody > tr input.payment-date-custom[name="payment-date-custom[' + length + ']"]').pickadate({
            selectMonths: true,
            selectYears: 2,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: false
        });
    });

    $(document).on('click', '.add-order', function(event) {
        event.preventDefault();

        var button = $(this),
            button_label = $(this).html();

        var errors = [];

        // Validate Everything
        if ( ! $('#rc-order-customer-email option:selected').val() ) {

            errors.push( 'Customer email is required.' );

        }

        if ( ! $('#rc-order-customer-first-name').val() ) {

            errors.push( 'Customer first name is required.' );

        }

        if ( ! $('#rc-order-customer-last-name').val() ) {

            errors.push( 'Customer last name is required.' );

        }

        if ( ! $('#rc-order-products > tbody > tr').length ) {

            errors.push( 'There are no products in the cart.' );

        }

        if ( errors ) {

            if ( errors.length ) {

                var errors_message = errors.join('<br>');

                swal({
                    type: 'error',
                    title: 'Oops...',
                    html: errors_message
                });

                return;

            }

        }

        var user = {
            email: $('#rc-order-customer-email option:selected').val(),
            first_name: $('#rc-order-customer-first-name').val(),
            last_name: $('#rc-order-customer-last-name').val(),
            billing_country: $('#rc-order-billing-country').find(':selected').val(),
            billing_address: $('#rc-order-billing-address').val(),
            billing_city: $('#rc-order-billing-city').val(),
            billing_state: $('#rc-order-billing-state').find(':selected').val(),
            billing_postcode: $('#rc-order-billing-postcode').val(),
            billing_phone: $('#rc-order-billing-phone').val()
        };

        if ( $('#rc-order-shipping-city').val() && $('#rc-order-shipping-address').val() ) {

            user.shipping_country = $('#rc-order-shipping-country').find(':selected').val();
            user.shipping_address = $('#rc-order-shipping-address').val();
            user.shipping_city = $('#rc-order-shipping-city').val();
            user.shipping_state = $('#rc-order-shipping-state').find(':selected').val();
            user.shipping_postcode = $('#rc-order-shipping-postcode').val();
            user.shipping_phone = $('#rc-order-shipping-phone').val();

        }

        var products = [];

        $('#rc-order-products tr').each(function(key, value) {
            if ( key !== 0 ) {

                var real_key = key - 1;

                var id      = $(this).data('product-id'),
                    type    = $(this).data('product-type'),
                    note    = $(this).find('textarea[name="product-note[' + real_key + ']"]').val(),
                    options = null,
                    price   = $(this).find('input[name="product-price[' + real_key + ']"]').val(),
                    qty     = $(this).find('input[name="product-qty[' + real_key + ']"]').val();

                if ( $('select[name="product-options[' + real_key + ']"]').length ) {

                    options = $('select[name="product-options[' + real_key + ']"] option:selected').val();

                }

                products[ real_key ] = {
                    'id': id,
                    'type': type,
                    'note': note,
                    'options': options,
                    'price': price,
                    'qty': qty
                };

            }
        });

        var payment_method = $('#payment-method').val(),
            payments = {},
            payment_method_slug = '',
            payment_redirect_url_append = '';

        if ( payment_method === '1' ) {
            payment_method_slug = 'full';
        }
        if ( payment_method === '2' ) {
            payment_method_slug = 'monthly';
            payment_redirect_url_append = '&monthly=true&first_payment=true';
        }

        if ( payment_method === '2' ) {

            var fixed_price = 0,
                fixed_payment = 0;
            $('#rc-order-products > tbody > tr').each(function(key, value) {
                fixed_price += Number( $(this).find('.product-total').html() );
            });
            $('#rc-order-payments-dates > tbody > tr').each(function(key, value) {
                fixed_payment += Number( $(this).find('input[name^=payment-price]').val() );
            });

            if ( fixed_price !== fixed_payment ) {

                var new_price = 0;
                if ( fixed_price > fixed_payment ) {
                    new_price = fixed_price - fixed_payment;
                }
                if ( fixed_payment > fixed_price ) {
                    new_price = fixed_payment - fixed_price;
                }

                $('#rc-order-payments-dates > tbody > tr:last-of-type').find('input[name^=payment-price]').attr( 'value', new_price );

            }

            payments.orders = {};

            $('#rc-order-payments-dates > tbody > tr').each(function(key, value) {
                var input  = $(this).find('input[name="payment-date-custom[' + key + ']"]').pickadate(),
                    picker = input.pickadate('picker'),
                    date   = picker.get('select', 'yyyy-mm-dd'),
                    price  = $(this).find('input[name="payment-price-custom[' + key + ']"]').val();

                var item = {
                    'order_date': date,
                    'order_price': price
                };

                payments.orders[key] = item;
            });

        }

        $.ajax({
            url: ajaxurl,
            dataType: 'JSON',
            type: 'POST',
            data: {
                products: products,
                payments: payments,
                payment_method: payment_method_slug,
                user: user,
                action: 'rc_ajax_add_to_cart'
            },
            beforeSend: function() {
                button.attr('disabled', 'disabled');
                button.html('Processing Order');
            },
            success: function(response) {
                if ( response.error === false ) {

                    window.open( response.redirect + payment_redirect_url_append );

                    // Reset everything
                    location.reload();

                } else {

                }
            },
            complete: function() {
                button.removeAttr('disabled');
                button.html(button_label);
            }
        });

    });

});