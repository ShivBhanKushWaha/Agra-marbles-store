"use client"

import { categories } from "@/Utils/Categories"
import Heading from "@/app/components/Heading"
import CategoryInput from "@/app/components/inputs/CategoryInput"
import CustomCheckBox from "@/app/components/inputs/CustomCheckbox"
import Input from "@/app/components/inputs/Input"
import TextArea from "@/app/components/inputs/TextArea"
import { useCallback, useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { colors } from "@/Utils/Colors"
import SelectColor from "@/app/components/inputs/SelectColor"
import Button from "@/app/components/Button"
import toast from "react-hot-toast"
import firebaseApp from "@/libs/firebase"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import axios from "axios"
import { useRouter } from "next/navigation"

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
}

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image:  string;
}


const AddProductForm = () => {

  const router = useRouter();
  const [isLoading,setIsLoading] = useState(false);
  const [images,setImages] = useState<ImageType[] | null>();
  const [isProductCreated,setIsProductCreated] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState:{errors}
  } = useForm<FieldValues>({
    defaultValues:{
      name: '',
      description: '',
      brand: '',
      category: '',
      inStock: '',
      images: [],
      price:"",
    }
  });

  useEffect(() => {
    reset();
    setImages(null);
    setIsProductCreated(false);
  },[isProductCreated,reset])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Product Data",data);
    // upload images to firebase
    // save product to mongodb
    setIsLoading(true);
    let uploadedImages : UploadedImageType[] = [];

    if(!data.category){
      setIsLoading(false)
      return toast.error('Category is not selected!');
    }

    if(!data.images || data.images.length === 0){
      setIsLoading(false)
      return toast.error('No selected images!');
    }

    if(data.inStock == false){
      setIsLoading(false)
      return toast.error("Product is Out of stock");
    }

    const handleImageUplaoads = async () => {
      toast('Creating product, Please wait...⏳');
      try{
        for(const item of data.images){
          if(item.image){

            const fileName = new Date().getTime() + '-' + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve,reject) => {

              uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused');
                    break;
                  case 'running':
                    console.log('Upload is running');
                    break;
                }
              },

              (error) => {
                // Handle unsuccessful uploads
                console.log('Error uplaoding image...',error.message);
                reject(error)
              },

              () => {
                  // Handle successful uploads on complete
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image:downloadURL
                      })
                      console.log('File available at', downloadURL);
                      resolve()
                    }
                  ).catch((error) => {
                    console.log('Error getting the download URL',error)
                    reject(error)
                  });
                }
              );
            });
          }
        }
      }
      catch(error){
        setIsLoading(false);
        return toast.error('Error occurred when image uploads 😟');
      }
    };

    await handleImageUplaoads();
    const productData = {...data, images: uploadedImages};

    axios.post('/api/product',productData).then(() => {
      toast.success('Product created 😊')
      setIsProductCreated(true);
      router.refresh();
    })
    .catch((error) => {
      toast.error('Some thing went wrong when saving product to DataBase 😟',error)
    }).finally(() => {
      setIsLoading(false)
    });
  };

  const category = watch("category");

  // from my code
  const setCustomValue = useCallback((id:string,value: any) => {
    setValue(id,value,{
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch:true,
        })
  },[setValue]);

  useEffect(() => {
    setCustomValue('images',images)
  },[images,setCustomValue]);

  const addImageToState = useCallback((value:ImageType) => {
    setImages((prev) => {
      if(!prev){
        return [value]
      }
      return[...prev,value]
    })
  },[]);

  const removeImageFromState = useCallback((value:ImageType) => {
    setImages((prev) => {
      if(prev){
        const filteredImages = prev.filter((item) => item.color !== value.color)
        return filteredImages;
      }
      return prev;
    });
  },[]);


  return (
      <>
        <Heading title="Add a Product" center/>

        <Input 
        label="Name" 
        id="name" 
        disabled={isLoading} 
        register={register} 
        errors={errors} 
        required/>

        <Input 
        label="Price" 
        id="price" 
        disabled={isLoading} 
        register={register} 
        errors={errors} 
        type="number" 
        required/>

        <Input 
        label="Brand" 
        id="brand" 
        disabled={isLoading} 
        register={register} 
        errors={errors} 
        required/>

        <TextArea 
        label="Description" 
        id="description" 
        disabled={isLoading} 
        register={register} 
        errors={errors} 
        required/>

        <CustomCheckBox id="inStock" register={register} label="This product is in stock"/>

        <div className="w-full font-medium">
          <div className="mb-2 font-semibold">Select category</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
            {categories.map((item) => {

              if(item.label === 'All') {
                return null;
              }
              return (
              <div key={item.label} className="col-span">
                <CategoryInput 
                onclick={(category) => setCustomValue("category",category)}
                selected={category === item.label}
                label={item.label} icon={item.icon} />
              </div>)
            })}
          </div>
        </div>

        <div className="w-full flex flex-col flex-wrap gap-4">
          <div>
            <div className="font-bold">
              Select the available product colors and upload their images.
            </div>
            <div className="text-sm">You must upload an image for each of the color selected otherwise your color selection will be ignored</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {colors.map((item,index) => {
              return <SelectColor key={index} item={item} 
              addImageToState={addImageToState} 
              removeImageFromState={removeImageFromState} 
              isProductCreated={isProductCreated}/>
            })}
          </div>
        </div>
        <Button label={isLoading ? 'Loading...' : 'Add Product'} onClick={handleSubmit(onSubmit)}/>
      </>
  )
}

export default AddProductForm
