import React from 'react'
import PageHeader from '../_components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import db from '@/lib/prisma'
import { CheckCircle2,  MoreVertical, XCircle } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_components/ProductAction'

export default function AdminProductPage() {
    return (
        <>
            <div className=" flex justify-between gap-4 items-center">
                <PageHeader>Products</PageHeader>
                <Button asChild variant='outline' size='lg'>
                    <Link href="/admin/products/new">
                        Add Product
                    </Link>
                </Button>

            </div>
            <ProductTable />
        </>

    )
}

async function ProductTable() {
    const products = await db.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCent: true,
            isAvailableForPurchase: true,
            _count: { select: { orders: true } }
        },
        orderBy: { name: "asc" }
    })

    if (products.length === 0) return <>No product found</>
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-0'>
                        <span className='sr-only'>Available For Purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Order</TableHead>
                </TableRow>
                <TableHead className='w-0'>
                    <span className='sr-only'>Action</span>
                </TableHead>

            </TableHeader>

            <TableBody>
                {products.map(product => (
                    <TableRow key={product.id}>
                        <TableCell>
                            {product.isAvailableForPurchase ? <>
                                <span className='sr-only'>Available</span>
                                <CheckCircle2 />
                            </> : <>
                                <span className='sr-only'>Unavailable</span>
                                <XCircle className='stroke-destructive' />
                            </>}

                        </TableCell>

                        <TableCell>{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.priceInCent / 100)}</TableCell>
                        <TableCell>{formatNumber(product._count.orders)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical />
                                    <span className='sr-only'>Actions</span>
                                </DropdownMenuTrigger>


                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a download href={`/admin/products/${product.id}/download`}>
                                            Download
                                        </a>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                               Edit
                                        </Link>
                                    </DropdownMenuItem>

                                    <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                                    <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </TableCell>

                    </TableRow>
                ))}

            </TableBody>


        </Table>
    )


}