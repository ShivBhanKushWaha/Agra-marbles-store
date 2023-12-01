"use client"

import { CartProductType } from "@/app/product/[productId]/ProductDetails"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import {toast} from 'react-hot-toast'


type CartContextType = {
    cartTotalQty:number;
    cartTotalAmount:number;
    cartProducts:CartProductType[] | null;
    handleAddProductToCart: (product: CartProductType) => void;
    handleRemoveProductFromCart: (product: CartProductType) => void;
    handleCartQtyIncrease: (product: CartProductType) => void;
    handleCartQtyDecrease: (product: CartProductType) => void;
    handleClearCart: () => void;
    paymentIntent : string | null;
    handleSetPaymentIntent : (value: string | null) => void;
}

interface Props{
    [propName: string]: any;
}

export const CartContext = createContext<CartContextType | null>(null);


export const CartContextProvider = (props:Props) => {

    const [cartTotalQty , setCartTotalQty] = useState(0);
    const [cartProducts,setCartProducts] = useState<CartProductType[] | null> (null);
    const [cartTotalAmount,setCartTotalAmount] = useState(0)
    const [paymentIntent,setPaymentIntent] = useState<string | null>(null);

     // extra by my side
    const [addingToCart, setAddingToCart] = useState(false);
    const [removingFromCart, setRemovingFromCart] = useState(false);

    // toast the message
    useEffect(() => {
        // extra
        if (addingToCart) {
            toast.success("Item added to cart!");
            setAddingToCart(false);
        }
        // extra
        if (removingFromCart) {
            toast.success("Item removed from cart!");
            setRemovingFromCart(false);
        }
    },[addingToCart,removingFromCart]);


     // Set useEffect for Getting the cart items in Local Storage
    useEffect(() => {

        const cartItems: any = localStorage.getItem("eShopCartItems");
        const cProducts: CartProductType[] | null = JSON.parse(cartItems);


        const eShopPaymentIntent:any = localStorage.getItem('eShopPaymentIntent')
        const paymentIntent: string | null = JSON.parse(eShopPaymentIntent)

        setCartProducts(cProducts);
        setPaymentIntent(paymentIntent);
    },[]);

     // Set UseEffect For Subtotal 
     // where we will go through the cartProducts array and use reduce for having a callback in the array and return the accumulated value. 
     // By having the acc and item as parameters, where we can create an itemTotal for
    useEffect(() => {
        const getTotals = () => {

            if(cartProducts){
                const {total,qty} = cartProducts?.reduce((acc,item) => {
                    const itemTotal = item.price * item.quantity

                    acc.total += itemTotal;
                    acc.qty += item.quantity;

                    return acc;
                },{
                    total:0,
                    qty:0
                });
                setCartTotalQty(qty)
                setCartTotalAmount(total);
            }
        };
        getTotals()
    },[cartProducts])

    // Add Product To Cart
    const handleAddProductToCart = useCallback((product:CartProductType) => {
        setCartProducts((prev) => {
            let updatedCart;
            if(prev){
                updatedCart = [...prev,product];
            }
            else{
                updatedCart = [product];
            };
            setAddingToCart(true);
            // toast.success("Product Added To Cart");
            localStorage.setItem("eShopCartItems",JSON.stringify(updatedCart));
            return updatedCart;
        });
    },[setAddingToCart]);

    // habdle remove product from cart
    const handleRemoveProductFromCart = useCallback(( product:CartProductType) => 
    {
       if(cartProducts){
        const filteredProduts = cartProducts.filter((item) => {
            return (item.id !== product.id);
        });

        setCartProducts(filteredProduts)
        // toast.success("Product removed from cart");
        setRemovingFromCart(true)

        localStorage.setItem("eShopCartItems",JSON.stringify(filteredProduts));
       }
    },[cartProducts]);

    // Create the Quantaty Increase
    const handleCartQtyIncrease = useCallback((product:CartProductType) => {
        let updatedCart;

        if(product.quantity === 10){
            return toast.success('Maximum Items Reached')
        }

        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

            if(existingIndex > -1){
                updatedCart[existingIndex].quantity = ++updatedCart[existingIndex].quantity;
            }

            setCartProducts(updatedCart);
            localStorage.setItem('eShopCartItems',JSON.stringify(updatedCart));
        }

    },[cartProducts]);

    // Create the Quantity Decrease
    const handleCartQtyDecrease = useCallback((product:CartProductType) => {
        let updatedCart;
        if(product.quantity === 1){
            return toast.error('Minimum Items reached');
        }
        if(cartProducts){
            updatedCart = [...cartProducts]

            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);

            if(existingIndex > -1){
                updatedCart[existingIndex].quantity = --updatedCart[existingIndex].quantity;
            }

            setCartProducts(updatedCart);
            localStorage.setItem('eShopCartItems',JSON.stringify(updatedCart))
        }
    },[cartProducts]);

   // Create the clear Handle clear cart constructur with dependencies array onto ca
    const handleClearCart = useCallback(() => {
        setCartProducts(null)
        setCartTotalQty(0)
        localStorage.setItem('eShopCartItems',JSON.stringify(null)); 
        // toast.success("Cart is Clear");
    },[cartProducts]);

    const handleSetPaymentIntent = useCallback((val : string | null) => {
        setPaymentIntent(val)
        localStorage.setItem('eShopPaymentIntent', JSON.stringify(val));
    },[paymentIntent]);

    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        paymentIntent,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
        handleSetPaymentIntent,
    };

    return <CartContext.Provider value={value} {...props}/>;
};

export const useCart = () =>{
    const context = useContext(CartContext)

    if(context === null){
        throw new Error("use Cart must be used within a CartContextProvider")
    }
    return context;
};
