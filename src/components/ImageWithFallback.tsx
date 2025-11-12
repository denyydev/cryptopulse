import { useState } from 'react'

type Props = {
  src?: string
  alt?: string
  className?: string
}

export default function ImageWithFallback({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={[
          'relative grid place-items-center overflow-hidden rounded-md border border-dashed',
          'border-slate-300/60 bg-slate-100 text-slate-600',
          'dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
          className,
        ].join(' ')}
      >
          <span className="text-lg leading-tight sm:text-xs">
            ой! картинка задержалась но скоро подъедет
          </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      referrerPolicy="no-referrer"
    />
  )
}
