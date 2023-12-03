import Stripe from "stripe";
import prisma from '@/libs/prismadb'
import { NextResponse } from "next/server";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import getCurrentUser from "@/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{
    apiVersion:"2023-10-16"
});


const calculateOrderAmount = (items: CartProductType[]) =>{
    const totalPrice = items.reduce((acc,item) => {
        const itemTotal = item.price * item.quantity;

        return acc + itemTotal
    },0);

    return Number(totalPrice.toFixed(2));
};

export async function POST(request:Request){
    const currentUser = await getCurrentUser();

    if(!currentUser){
        return NextResponse.error();
    }

    const body = await request.json();
    const {items, payment_intent_id} = body
    const total = calculateOrderAmount(items);

    // 100 se multiple krege total me usd ke liye 
    // data to store in the database

    const orderData = {
        user:{connect:{id:currentUser.id}},
        amount:total,
        currency:'INR',
        status:"pending",
        deliveryStatus:"pending",
        paymentIntentId: payment_intent_id,
        products:items
    }
    // if payment intent id exist in the body then it will

    if(payment_intent_id){

        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)

        if(current_intent){
            const updated_intent = await stripe.paymentIntents.update(
                payment_intent_id,{
                    amount: total
                }
            );

            // update the order
            const [existing_order,update_order] = await Promise.all([
                prisma.order.findFirst({
                    where: {paymentIntentId:payment_intent_id},
                }),
                prisma.order.update({
                    where : {paymentIntentId:payment_intent_id},
                    data:{
                        amount:total,
                        products:items,
                    },
                }),
            ]);

            // Error if no existing orders
            if(!existing_order){
                return NextResponse.error()
            }
            return  NextResponse.json({paymentIntent:updated_intent});
        }
    }
    else{
        // create the intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount:total,
            currency:"inr",
            automatic_payment_methods:{enabled:true},
        });

        // create the order
        orderData.paymentIntentId = paymentIntent.id;
        await prisma.order.create({
            data : orderData
        });
        return  NextResponse.json({paymentIntent})
    }

    // default error can return a if all statement fails
    return NextResponse.error();
} 
