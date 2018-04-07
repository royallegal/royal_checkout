<?php
$order_id = intVal($_GET["order_id"]);

$stripe = array(
  "secret_key"      => "sk_test_WOrNxjLfXWF9dd6KBFDR9rC8",
  "publishable_key" => "pk_test_8DuBsvel6bV2fcX4WCSBANnE"
);

\Stripe\Stripe::setApiKey($stripe['secret_key']);



if ( isset($order_id) && is_numeric($order_id) ) {
    $order = wc_get_order( $order_id );
    $customer_id = $order->customer_id;
    $payments = json_decode(get_post_meta($order->id, 'payment', TRUE), TRUE);
    $customer = get_user_meta($customer_id);

    $payments_number = count($payments);
    $payments_total = 0;
    foreach ($payments as $key => $value) {
        foreach ($value as $key => $value) {
            if ( $key == "order_price" )
                $payments_total+=$value;
        }
    }
}

// Check if form was submitted
if (($_POST)) {
    $pay1st = $_POST["pay1st"];
    $stripeToken = $_POST["stripeToken"];
    $stripeEmail = $_POST["stripeEmail"];

    // Create a stripe customer
    $customer = Royal_Checkout::create_customer($stripeEmail, $stripeToken);
    // Save stripe customer into local db
    $save_customer = Royal_Checkout::save_customer($customer);

    if ( $save_customer != FALSE ) {
        // Check if we want to charge 1st payment now
        $charge_plan = [];
        $period = 0;

        foreach ($payments as $key => $value) {
            foreach ($value as $key => $value) {
                if ( $key == "order_date" )
                    $charge_plan[$period] = $value;
                if ( $key == "order_price" )
                    $charge_plan[$period].= ";@;".$value;
            }
            $period++;
        }

        $payment_remaining = $payments_total;
        foreach ($charge_plan as $key => $value) {
            $payment = explode(";@;", $value);
            $payment_remaining-=$payment[1];
            if ( ($pay1st == "on" && $key == 0) || (date('j F, Y') == $payment[0]) ) {
                try {
                    $charge_now = Royal_Checkout::charge_customer($customer, intVal($payment[1])*100);
    
                    if ( $charge_now->status == "succeeded" )
                        echo "#".($key+1)." <strong>$".intVal($payment[1])."USD Charged successfully!</strong><br>";
                    else
                        throw new Exception("bad status", 1);

                } catch (Exception $err) {
                    echo "Problem to charge 1st payment! Other payments plan will be not scheduled<br>";
                    break;
                }
            } else {
                $payment_schedule_date = $payment[0];
                $payment_amout = $payment[1];
                $schedule_payment = Royal_Checkout::schedule_payment($save_customer, $payment_schedule_date, $payment_amout, $payment_remaining);
                if ( $schedule_payment == TRUE )
                    echo "#".($key+1)." Payment scheduled for ".$payment[0]." for $".$payment[1]." USD<br>";
                else
                    echo "Problem with payment #".($key+1)." – <i>(".$payment[0]." for $".$payment[1]." USD)</i><br>";
            }
        }
    } else {
        echo "Error to Save Customer into Database. Try again.";
    }

} elseif(isset($order)) {

?>
<pre>
    <strong>Order ID:</strong> <?=$order_id?> <br>
    <strong>Customer:</strong> <?=$customer["billing_email"][0]?> &lt;<?=$customer["first_name"][0]?> <?=$customer["last_name"][0]?> (<?=$customer["nickname"][0]?>)&gt;<br>
    <strong>Amount of Payments:</strong> <?=intVal($payments_number)?> <br>
    <strong>Total to Pay:</strong> $<?=intVal($payments_total)?> USD <br>
<?php
    foreach ($payments as $key => $value) {
        echo "  <strong>#".($key+1)." Payment: </strong> ";
        foreach ($value as $key => $value) {
            if ( $key == "order_date" )
                echo $value;
            if ( $key == "order_price" )
                echo " – $".$value." USD<br> \n";
        }
    }
?>
</pre>
<form action="" method="post">
    <input type="checkbox" id="pay1st" name="pay1st" />
    <label for="pay1st">
        Charge 1st Payment (or total) now
        <br><small>(IMPORTANT: If the date of 1st Payment is today you don't need to check this)</small><br>
    </label>
  <script src="https://checkout.stripe.com/checkout.js" class="stripe-button"
          data-key="<?php echo $stripe['publishable_key']; ?>"
          data-description="Payment Form"
          data-locale="auto" data-email="<?=$customer["billing_email"][0]?>"></script>
</form>
<?php
    // Check if the amount to pay is more than 0 and the amount of payments is more than 0
    if ($payments_number > 0 && $payments_total > 0) {

    }
} else {
    echo "Use a valid order_id please!";
}
?>