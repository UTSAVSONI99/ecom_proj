"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';

import React, { useActionState } from 'react'
import { addProduct } from '../../_action/product';
import {  useFormStatus } from 'react-dom';

export default function ProductForm() {
   const[error,action]=useActionState(addProduct,{})
   const [priceInCents, setPriceInCents] = React.useState<number>();
   return (

      <form action={action} className='space-y-8'>
         <div className='space-y-2'>
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required />
            {error.name && <div className='text-red-400'>{error.name}</div> }
         </div>
         <div className='space-y-2'>
            <Label htmlFor="priceInCents">PriceInCents</Label>
            <Input type="Number" id="priceInCents" name="priceInCents" required  value={priceInCents ?? ""} 
               onChange={e => setPriceInCents(Number(e.target.value) || undefined)} />
               {error.priceInCents && <div className='text-red-400'>{error.priceInCents}</div> }
         </div>
         <div className='text-muted-foreground'>
            {formatCurrency((priceInCents || 0) / 100)}
         </div>

         <div className='space-y-2'>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
            {error.description && <div className='text-red-400'>{error.description}</div> }
         </div>

         <div className='space-y-2'>
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required />
            {error.file && <div className='text-red-400'>{error.file}</div> }
         </div>

         <div className='space-y-2'>
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required />
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