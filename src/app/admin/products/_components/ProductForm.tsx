"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';

import React, { useActionState, useState } from 'react'
import { addProduct, updateProduct } from '../../_action/product';
import {  useFormStatus } from 'react-dom';
import { Product } from "@prisma/client";
import Image from 'next/image';

export default function ProductForm( {product}:{
   product?:Product | null}) {
      const [error, action] = useActionState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  )
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCent
  )

 
   return (

      <form action={action} className='space-y-8'>
         <div className='space-y-2'>
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required  defaultValue={product?.name || ""}/>
            {error.name && <div className='text-red-400'>{error.name}</div> }
         </div>
         <div className='space-y-2'>
            <Label htmlFor="priceInCents">PriceInCents</Label>
            <Input type="Number" id="priceInCents" name="priceInCents" required  value={priceInCents ?? ""} 
               onChange={e => setPriceInCents(Number(e.target.value) || undefined)} />
               {error.priceInCent && <div className='text-red-400'>{error.priceInCent}</div> }
         </div>
         <div className='text-muted-foreground'>
            {formatCurrency((priceInCents || 0) / 100)}
         </div>

         <div className='space-y-2'>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required defaultValue={product?.description} />
            {error.description && <div className='text-red-400'>{error.description}</div> }
         </div>

         <div className='space-y-2'>
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required={product == null} />
            {product != null && ( <div className='text-sm text-muted-foreground'>{product.filePath}</div>)}
            {error.file && <div className='text-red-400'>{error.file}</div> }
         </div>

         <div className='space-y-2'>
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={product == null}/>
            {product != null && ( <Image src={product.imagePath} alt={product.name} width={100} height={100} /> )}
            {error.image && <div className='text-red-400'>{error.image}</div> }
         </div>
         <SubmitButton/>
      </form>
   )
}

function SubmitButton() {

   const { pending } = useFormStatus();
   return (
      <Button type='submit' disabled={pending}> {pending ? 'Saving...' : "Save"}</Button>
   )
}

