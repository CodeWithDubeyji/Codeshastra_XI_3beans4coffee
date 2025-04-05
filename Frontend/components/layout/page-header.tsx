"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  backLink?: string
}

export default function PageHeader({ title, backLink }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center mb-8 md:mb-12"
    >
      {backLink && (
        <Link
          href={backLink}
          className="mr-4 bg-white p-2 rounded-full elegant-shadow hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-blue-600" />
        </Link>
      )}
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
    </motion.div>
  )
}

