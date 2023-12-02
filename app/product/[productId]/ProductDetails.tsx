"use client";


import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/SetQuantity";
import Button from "@/app/components/Button";
import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ProductImage from "@/app/components/products/ProductImage";
import { useCart } from "@/hooks/useCart";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import {toast} from 'react-hot-toast'

interface ProductDetailsProps{
    product:any
}

export type CartProductType = {
    id:string,
    name:string,
    description:string,
    category:string,
    brand:string,
    selectedImg:selectedImgType,
    quantity:number,
    price:number
}

export type selectedImgType = {
    color: string,
    colorCode:string,
    image: string
}

const Horizontal = () => {
    return <hr className="w-[30%] my-2"/>
}

const ProductDetails: React.FC<ProductDetailsProps> = ({product}) => {

    const {handleAddProductToCart,cartProducts} = useCart();

    const [isProductInCart,setIsProductInCart] = useState(false);

    const [CartProduct, setCartProduct] = useState<CartProductType>({
        id:product.id,
        name:product.name,
        description:product.description,
        category:product.category,
        brand:product.brand,
        selectedImg:{...product.images[0]},
        quantity:1,
        price:product.price
    });
    
    const router = useRouter();

    const handleColorSelect = useCallback((value:selectedImgType) => {
        setCartProduct((prev) => {
            return { ...prev , selectedImg : value };
        })
    },[]);
    
    const handleQtyIncrease = useCallback(() => {
        if(CartProduct.quantity === 10){
            return toast.success("Maximum Items Reached");
        }

        setCartProduct((prev) => { 
            return { ...prev, quantity: prev.quantity + 1}});
        
    },[CartProduct]);

    const handleQtyDecrease = useCallback(() => {
        if(CartProduct.quantity === 1){
            return toast.error('Minimum Items reached');
        }
        setCartProduct((prev) => { 
            return { ...prev, quantity: prev.quantity - 1}});

    },[CartProduct])

    useEffect(() => {
        setIsProductInCart(false);

        if(cartProducts){
            const existingIndex = cartProducts.findIndex((item) => item.id === product.id)

            if(existingIndex > -1){
                setIsProductInCart(true)
            }
        }
    },[cartProducts,product.id]);

    const productRating = product.reviews.reduce((acc:number,item:any) => item.rating + acc,0)/product.reviews.length;

    return ( 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductImage cartProduct={CartProduct} product={product} handleColorSelect={handleColorSelect}/>
            <div className="flex flex-col gap-1 text-slate-500 text-sm">
                <h3 className="text-3xl font-medium text-slate-700">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <Rating value={productRating} readOnly/>
                    <div>{product.reviews.length} reviews</div>
                </div>
                <Horizontal/>
                <div className="text-justify">{product.description}</div>
                <Horizontal/>
                <div>
                    <span className="font-semibold">CATEGORY:</span> {product.category}
                </div>
                <div>
                    <span className="font-semibold">BRAND:</span> {product.brand}
                </div>
                <div className={product.inStock ? 'text-teal-400' : 'text-rose-400'}>{product.inStock ? 'In Stock' : 'Out Of Stock'}</div>
                <Horizontal/>
                {isProductInCart ? 
                (<>
                    <p className="mb-2 text-slate-500 flex items-center gap-1">
                        <MdCheckCircle size={20} className="text-teal-400"/>
                        <span>Already Added</span>
                    </p>
                    <div className="max-w-[300px]">
                        <Button label="View Cart" outline onClick={() => router.push("/cart")}/>
                    </div>
                </>) : (<>
                    <SetColor cartProduct={CartProduct} images={product.images} handColorSelect={handleColorSelect}/>
                    <Horizontal/>
                    <SetQuantity cartProduct={CartProduct} handleQtyDecrease={handleQtyDecrease} handleQtyIncrease={handleQtyIncrease}/>
                    <Horizontal/>
                    <div className="max-w-[300px]">
                        {
                            product.inStock 
                            ?  
                            <Button  label="Add To Cart" onClick={() => handleAddProductToCart(CartProduct)}/> 
                            : 
                            <Button  label="Out of Stock" outline  onClick={() => toast.error("Out of stock")}/>
                        }
                    </div>
                </>)
                }
            </div>
        </div>
     );
}
 
export default ProductDetails;
