jQuery(document).ready(function($) {
    'use strict';

    // function to round, used to get total months based on monthly plan
    function precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

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

    function add(a, b) {
        return Number( a ) + Number( b );
    }

    function sum_array( array ) {

        var result = array.reduce(add, 0);

        return result;

    }

    // Init Select2 on Country and State
    if ( $('#rc-order-billing-country, #rc-order-shipping-country').length ) {

        $('#rc-order-billing-country, #rc-order-shipping-country').select2();
        $('#rc-order-billing-state, #rc-order-shipping-state').select2();

        // On Country Change
        $(document).on('select2:select', '#rc-order-billing-country, #rc-order-shipping-country', function(event) {
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
                    $('#rc-order-billing-state, #rc-order-shipping-state').empty().append( response ).trigger('change');
                },
                error: function( response ) {
                    console.log( response );
                }
            });
        });

    }

    // Toggle Billing
    $(document).one('click', '.show-billing', function(event) {
        event.preventDefault();

        $(this).parent().parent().remove();
        $('.billing-info').addClass('is-active');
        $('#rc-order-billing-address, #rc-order-billing-city, #rc-order-billing-postcode, #rc-order-billing-phone').parent().find('label').addClass('active');
    });

    // Choose Customer
    if ( $('#rc-order-customer-email').length ) {
        $('#rc-order-customer-email').select2({
            placeholder: 'Find a User',
            allowClear: true,
            tags: true
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
                        $('#rc-order-billing-country, #rc-order-shipping-country').val( response.billing_country ).trigger('change');

                        var state = response.billing_state;

                        $('#rc-order-customer-first-name, #rc-order-customer-last-name, #rc-order-billing-address, #rc-order-billing-city, #rc-order-billing-postcode, #rc-order-billing-phone').focus();

                        $.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                id: response.billing_country,
                                action: 'rc_ajax_get_states'
                            },
                            success: function( response ) {
                                $('#rc-order-billing-state, #rc-order-shipping-state').empty().append( response ).trigger('change');
                                $('#rc-order-billing-state, #rc-order-shipping-state').val( state ).trigger('change');
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
                        product_html += '<div class="input-field no-image"><textarea style="padding-bottom:0 !important;" name="product-note[' + rows + ']" placeholder="Add note" class="materialize-textarea"></textarea><label>' + response.name + '</label></div>';
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
        });

        // Init Payment Type
        $('#rc-order-payment-type').select2({
            minimumResultsForSearch: Infinity
        });



$("#rc-oder-same-for-shipping").on("change", function() {
    if(this.checked) {
        $("#shipping_form :input").attr("disabled", true);
    } else {
        $("#shipping_form :input").attr("disabled", false);
    }
});


$("#add-payment").on('click', function(event) {
    event.preventDefault();

    $('#rc-order-payments-dates tbody').empty();
    $('#rc-order-payments-dates').parent().addClass('hide');

    // Check if there are any products in the cart.
    if ($('#rc-order-products tbody tr').length) {

        // Get all non subscription products.
        var regular_products = 0;
        $('#rc-order-products tbody tr:not([data-product-type*="subscription"])').each(function() {
            regular_products = Number(regular_products) + Number($(this).find('.product-total').html());
        });

        // Get all subscription products.
        var subscription_products = 0;
        $('#rc-order-products tbody tr[data-product-type*="subscription"]').each(function() {
            subscription_products = Number(subscription_products) + Number($(this).find('.product-total').html());
        });


        var monthly_or_number_html = '<div class="input-field">';
        monthly_or_number_html += '<input type="number" id="downpayment" name="downpayment">';
        monthly_or_number_html += '<label for="downpayment">First Payment</label>';
        monthly_or_number_html += '</div>';
        monthly_or_number_html += '<div class="input-field">';
        monthly_or_number_html += '<input type="number" id="monthly-price" name="monthly-price">';
        monthly_or_number_html += '<label for="monthly-price">Monthly Price</label>';
        monthly_or_number_html += '</div>';
        //monthly_or_number_html += '<p>OR</p>';
        //monthly_or_number_html += '<div class="input-field">';
        //monthly_or_number_html += '<input type="number" id="number-of-months" name="number-of-months" step="1">';
        //monthly_or_number_html += '<label for="number-of-months">Number of Months</label>';
        //monthly_or_number_html += '</div>';

        swal({
            title: 'Payment Plan',
            type: 'info',
            html: monthly_or_number_html,
            preConfirm: function() {
                var downpayment = $('#downpayment').val(),
                    monthly = $('#monthly-price').val(),
                    errors = '';

                // Downpayment is required.
                if (!downpayment) {

                    errors += 'First Payment can\'t be empty.<br><br>';

                }


                // Display Errors
                if (errors) {

                    swal.showValidationError(errors);

                    setTimeout(function() {
                        swal.resetValidationError();
                    }, 5000);

                } else {

                    // Get total
                    var payments = [];
                    var order_total = Number(regular_products+subscription_products);
                    var first_payment = Number(downpayment);
                    var monthly_share = monthly;
                    var total_months;
                    var remaining_balance;
                    var round_monthly_share;
                    var round_total_months;
                    var __remaining = order_total;


                    if ( order_total == first_payment ) {
                        // Will pay all on 1st payment
                        payments.push(first_payment);
                    } else {
                        total_months = (order_total - first_payment) / monthly_share;
                        remaining_balance = (order_total - first_payment);
                        round_total_months = precisionRound(total_months, 0);
                        round_monthly_share = total_months * monthly_share / round_total_months;
                        payments.push(first_payment);
                        __remaining-=first_payment;
                        for (var i = 0; i < round_total_months; i++) {
                            if ( __remaining < monthly_share )
                                payments.push(__remaining);
                            else {
                                payments.push(monthly_share);
                                __remaining-=monthly_share;
                            }
                        }
                        if ( __remaining > 0 )
                            payments.push(__remaining);
                    }

                    // Append Payments
                    var payments_html = '';
                    $.each(payments, function(key, value) {
                        payments_html += '<tr>';
                        payments_html += '<td><a href="#" class="remove-payment">X</a></td>';
                        payments_html += '<td>';
                        payments_html += '<div class="input-field"><input type="text" class="datepicker" name="payment-date[' + key + ']"></div>';
                        payments_html += '</td>';
                        payments_html += '<td>';
                        payments_html += '<div class="input-field"><input type="number" name="payment-price[' + key + ']" value="' + value + '"></div>';
                        payments_html += '</td>';
                        payments_html += '</tr>';
                    });

                    $('#rc-order-payments-dates tbody').append(payments_html);

                    // Initialize every datepicker and set the date.
                    $.each(payments, function(key, value) {

                        var date = '';

                        if (key === 0) {

                            date = moment().format('MM/DD/YYYY');

                        } else {

                            date = moment().add(key, 'months').format('MM/DD/YYYY');

                        }

                        $('.datepicker[name="payment-date[' + key + ']"]').pickadate({
                            selectMonths: true,
                            selectYears: 2,
                            today: 'Today',
                            clear: 'Clear',
                            close: 'Ok',
                            closeOnSelect: false
                        });

                        $('.datepicker[name="payment-date[' + key + ']"]').pickadate('picker').set('select', date, {
                            format: 'mm/dd/yyyy'
                        }).trigger('change');
                    });
                    $('#rc-order-payments-dates').parent().removeClass('hide');
                }
            }
        });
    } else {
        swal({
            type: 'error',
            title: 'Oops...',
            html: 'You need to select at least 1 product'
        });
    }
});





        // On custom payment type, show dates and amounts.
        $('#rc-order-payment-type').on('select2:select', function(event) {
            event.preventDefault();

            $('#rc-order-payments-dates tbody').empty();
            $('#rc-order-payments-dates').parent().addClass('hide');

            var data = event.params.data;

            // If Custom or Monthly
            if ( data.id === '1' || data.id === '2' ) {
                
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

                    if ( data.id === '1' ) {
                        // If Monthly

                        var monthly_or_number_html = '<div class="input-field">';
                            monthly_or_number_html += '<input type="number" id="downpayment" name="downpayment">';
                            monthly_or_number_html += '<label for="downpayment">First Payment</label>';
                            monthly_or_number_html += '</div>';
                            monthly_or_number_html += '<div class="input-field">';
                            monthly_or_number_html += '<input type="number" id="monthly-price" name="monthly-price">';
                            monthly_or_number_html += '<label for="monthly-price">Monthly Price</label>';
                            monthly_or_number_html += '</div>';
                            //monthly_or_number_html += '<p>OR</p>';
                            //monthly_or_number_html += '<div class="input-field">';
                            //monthly_or_number_html += '<input type="number" id="number-of-months" name="number-of-months" step="1">';
                            //monthly_or_number_html += '<label for="number-of-months">Number of Months</label>';
                            //monthly_or_number_html += '</div>';

                        swal({
                            title: 'Payment Plan',
                            type: 'info',
                            html: monthly_or_number_html,
                            preConfirm: function() {
                                var downpayment = $('#downpayment').val(),
                                    monthly     = $('#monthly-price').val(),
                                    months      = $('#number-of-months').val(),
                                    errors      = '';

                                // Downpayment is required.
                                if ( ! downpayment ) {

                                    errors += 'Downpayment can\'t be empty for "Monthly" option.<br><br>';

                                }

                                // Either monthly price or number of months must be filled.
                                if ( ! monthly && ! months ) {

                                    errors += 'Please enter either monthly price or number of months.';

                                }

                                // Only monthly price or number of months can be filled.
                                if ( monthly && months ) {

                                    errors += 'Please enter either monthly price or number of months.';

                                }

                                // Display Errors
                                if ( errors ) {

                                    swal.showValidationError( errors );

                                    setTimeout(function() {
                                        swal.resetValidationError();
                                    }, 5000);

                                } else {

                                    // Get total
                                    var total = regular_products - Number( downpayment ),
                                        payments = [],
                                        first_payment = Number( downpayment ) + subscription_products;

                                    // Split payments depending on filled option above.
                                    if ( monthly ) {

                                        payments = chunkize( total, monthly );

                                        payments.unshift( first_payment );

                                    }

                                    if ( months ) {

                                        var payment = total / months;

                                        for ( var i = 0; i < months; i++ ) {

                                            if ( i === months - 1 ) {
                                                payments.push( total - sum_array( payments ) );
                                            } else {
                                                payments.push( Math.trunc( payment ) );
                                            }

                                        }

                                        payments.unshift( first_payment );

                                    }

                                    // Append Payments
                                    var payments_html = '';
                                    $.each(payments, function(key, value) {
                                        payments_html += '<tr>';
                                        payments_html += '<td><a href="#" class="remove-payment">X</a></td>';
                                        payments_html += '<td>';
                                        payments_html += '<div class="input-field"><input type="text" class="datepicker" name="payment-date[' + key + ']" disabled></div>';
                                        payments_html += '</td>';
                                        payments_html += '<td>';
                                        payments_html += '<div class="input-field"><input type="number" name="payment-price[' + key + ']" value="' + value + '" disabled></div>';
                                        payments_html += '</td>';
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

                                        $('.datepicker[name="payment-date[' + key + ']"]').pickadate({
                                            selectMonths: true,
                                            selectYears: 2,
                                            today: 'Today',
                                            clear: 'Clear',
                                            close: 'Ok',
                                            closeOnSelect: false
                                        });

                                        $('.datepicker[name="payment-date[' + key + ']"]').pickadate('picker').set('select', date, { format: 'mm/dd/yyyy' }).trigger('change');
                                    });

                                }
                            }
                        });

                    } else {
                        // If Custom

                        // Show Button to Add
                        $('.add-payment-date').removeClass('hide');

                        var numer_of_payments = '<div class="input-field">';
                        numer_of_payments += '<input type="number" id="downpayment" name="downpayment">';
                        numer_of_payments += '<label for="downpayment">Downpayment</label>';
                        numer_of_payments += '</div>';
                        numer_of_payments += '<div class="input-field">';
                        numer_of_payments += '<input type="number" id="number-of-payments" name="number-of-payments" step="1">';
                        numer_of_payments += '<label for="number-of-payments">Number of Payments</label>';
                        numer_of_payments += '</div>';

                        swal({
                            title: 'Additional Custom Info',
                            type: 'info',
                            html: numer_of_payments,
                            preConfirm: function() {
                                var downpayment  = $('#downpayment').val(),
                                    num_payments = $('#number-of-payments').val(),
                                    errors       = '';

                                // Downpayment is required.
                                if ( ! downpayment ) {

                                    errors += 'Downpayment can\'t be empty for "Monthly" option.<br><br>';

                                }

                                // Number of months is required.
                                if ( ! num_payments ) {

                                    errors += 'Number of payments can\'t be empty.';

                                }

                                // Display Errors
                                if ( errors ) {

                                    swal.showValidationError( errors );

                                    setTimeout(function() {
                                        swal.resetValidationError();
                                    }, 5000);

                                } else {

                                    // Get total
                                    var total = regular_products - Number( downpayment ),
                                        payments = [],
                                        first_payment = Number( downpayment ) + subscription_products;

                                    var payment = total / num_payments;

                                    for ( var i = 0; i < num_payments; i++ ) {

                                        if ( i === num_payments - 1 ) {
                                            payments.push( total - sum_array( payments ) );
                                        } else {
                                            payments.push( Math.trunc( payment ) );
                                        }

                                    }

                                    payments.unshift( first_payment );

                                    // Append Payments
                                    var payments_html = '';
                                    $.each(payments, function(key, value) {
                                        payments_html += '<tr>';
                                        payments_html += '<td><a href="#" class="remove-payment">X</a></td>';
                                        payments_html += '<td>';
                                        payments_html += '<div class="input-field"><input type="text" class="datepicker payment-date-custom" name="payment-date-custom[' + key + ']"></div>';
                                        payments_html += '</td>';
                                        payments_html += '<td>';
                                        payments_html += '<div class="input-field"><input type="number" class="payment-price-custom" name="payment-price-custom[' + key + ']" value="' + value + '"></div>';
                                        payments_html += '</td>';
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

                    }

                    $('#rc-order-payments-dates').parent().removeClass('hide');

                }

            }
        });
    }

    // Remove payment from the "list".
    $(document).on('click', '.remove-payment', function(event) {
        event.preventDefault();

        $(this).parent().parent().remove();

        // Fix index(es) on other products in the "cart".
        $('#rc-order-payments-dates > tbody > tr').each(function( index ) {
            $(this).find('input.payment-date-custom').attr('name', 'payment-date-custom[' + index + ']');
            $(this).find('input.payment-price-custom').attr('name', 'payment-price-custom[' + index + ']');
        });
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

    $(document).on('click', '.calc', function(event) {
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
            billing_phone: $('#rc-order-billing-phone').val(),
            shipping_country: $('#rc-order-shipping-country').find(':selected').val(),
            shipping_address: $('#rc-order-shipping-address').val(),
            shipping_city: $('#rc-order-shipping-city').val(),
            shipping_state: $('#rc-order-shipping-state').find(':selected').val(),
            shipping_postcode: $('#rc-order-shipping-postcode').val(),
            shipping_phone: $('#rc-order-shipping-phone').val()
        };

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

        var payments = {};

        $('#rc-order-payments-dates > tbody > tr').each(function(key, value) {
            var $input = $(this).find('input[name="payment-date[' + key + ']"]').pickadate(),
                picker = $input.pickadate('picker'),
                date = picker.get(),
                price = $(this).find('input[name="payment-price[' + key + ']"]').val(),
                item = {
                    'order_date': date,
                    'order_price': price
                };
                payments[key] = item;
        });

        $.ajax({
            url: ajaxurl,
            dataType: 'JSON',
            type: 'POST',
            data: {
                products: products,
                payments: payments,
                user: user,
                action: 'rc_ajax_add_to_cart'
            },
            beforeSend: function() {
                button.attr('disabled', 'disabled');
                button.html('Processing Order');
            },
            success: function(response) {
                if ( response.error === false ) {
                    // Redirect and go to checkout
                    window.location.replace(response.redirect);
                } else {

                }
            },
            complete: function(response) {
                button.removeAttr('disabled');
                button.html(button_label);
            }
        });

    });

});