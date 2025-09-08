import db from '@/lib/prisma'
import React from 'react'
import { Product } from '../../../generated/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from "react"
import { ArrowRightIcon } from 'lucide-react'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { cache } from '@/lib/cache'


const getMostPopularProducts = cache(  () => {

    return db.product.findMany({

        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: 'desc' } },
        take: 6
    })


},["/","getMostPopularProducts"],{revalidate: 60*60*24 } )


const getNewestProducts= cache(()=> {

    return db.product.findMany({

        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: 'desc' },
        take: 6
    })


} ,["/","getNewestProducts"] )

export default function HomePage() {
    return (
        <main className='space-y-6'>
            <ProductGridSection title="Most Popular" productFetcher={getMostPopularProducts} />
            <ProductGridSection title='Newest' productFetcher={getNewestProducts} />

        </main>
    )
}

type ProductGridSectionProps = {

    title: string
    productFetcher: () => Promise<Product[]>
}

function ProductGridSection({ title, productFetcher }: ProductGridSectionProps) {

    return (
        <div className='space-y-4'>

            <div className='flex gap-4'>
                <h2 className='text-3xl font-bold'>{title}</h2>
                <Button variant={'outline'} asChild>
                    <Link href='/products' className='space-x-2'>
                        <span>View All</span>
                        <ArrowRightIcon className='size-4' />


                    </Link>

                </Button>
            </div>

            <div className='grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4'>

                <Suspense
                    fallback={
                        <>
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                        </>
                    }
                >
                    <ProductSuspense productFetcher={productFetcher} />
                </Suspense>
            </div>
        </div>
    )

}


async function ProductSuspense({ productFetcher }: { productFetcher: () => Promise<Product[]> }) {

    return (await productFetcher()).map(product => (
        <ProductCard key={product.id} {...product} />
    ))


}