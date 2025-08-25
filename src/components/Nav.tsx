"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { ComponentProps } from 'react'


import { cn } from '@/lib/utils'

export default function Nav({children}:{children: React.ReactNode}) {
  return (<nav className="bg-primary text-primary-foreground flex  justify-center px-4">
       {children}
    </nav>
  )
}

export function NavLink(props:Omit<ComponentProps<typeof Link>,"className">){

    const pathname= usePathname();
    return (
        <Link {...props} className={cn("p-4 hover:bg-black hover:text-white focus-visible:bg-secondary focus-visible:text-secondary-foreground", pathname === props.href && "bg-primary text-foreground")}/>
    )
}