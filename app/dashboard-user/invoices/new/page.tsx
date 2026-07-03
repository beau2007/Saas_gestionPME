"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import CreateInvoiceModal from '@/components/compagnie-dashboard/invoices/CreateInvoiceModal'

export default function Page() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6">
      <CreateInvoiceModal inline onClose={() => router.back()} />
    </div>
  )
}