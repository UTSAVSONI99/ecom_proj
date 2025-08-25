import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import db from '@/lib/prisma'
import { formatCurrency, formatNumber } from '@/lib/formatters'

async function getSalesData(){
  
  const data =await db.order.aggregate({
    _sum: {PricePaidInCent: true},
    _count:  true
  }
)
return{
  amount: (data._sum.PricePaidInCent || 0)/100,
  numberOfSales: data._count
}
 
}

async function getUserData(){
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: {PricePaidInCent: true},
  
    })
  ])

  return {
    userCount,
    averageValuePerUser:userCount===0 ? 0 : (orderData._sum.PricePaidInCent || 0) / userCount / 100
  }
}

async function getProductData() {
  const [activeCount,inactiveCount] = await Promise.all([
    db.product.count({where:{isAvailableForPurchase: true}}),
    db.product.count({where:{isAvailableForPurchase: false}}),
  ]);
 
    return {activeCount, inactiveCount}
  
}
await wait(2000)

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}



export default async function AdminDashboard() {
  const salesData = await getSalesData()
  const userData = await getUserData()
  const productData = await getProductData()
  return (
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>

<DashboardCard 
  title='Total Sales'
  description={ `${formatNumber(salesData.numberOfSales)}orders`}
  body={ formatCurrency(salesData.amount)}
/>
<DashboardCard 
  title='Total Sales'
  description={ `${formatCurrency(userData.averageValuePerUser)} Average Value `}
  body={ formatNumber (userData.userCount)}
/>
<DashboardCard 
  title='Total Sales'
  description={ `${formatCurrency(productData.inactiveCount)} Inactive  `}
  body={ formatNumber (productData.activeCount)}
/>
</div>
  )
}


function DashboardCard({title, description, body}:{title:string, description:string, body:string}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
         <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  )
}