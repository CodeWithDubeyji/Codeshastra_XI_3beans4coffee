'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TripDataPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('users').select('*')
      if (error) console.error(error)
      else setData(data)
    }
    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trip Data</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
