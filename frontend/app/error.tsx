'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Не удалось загрузить страницу</h1>
      <p className="max-w-md text-muted-foreground">
        Обновите страницу или попробуйте ещё раз. Если ошибка повторяется — напишите нам.
      </p>
      <Button type="button" onClick={reset} className="rounded-full">
        Попробовать снова
      </Button>
    </div>
  )
}
