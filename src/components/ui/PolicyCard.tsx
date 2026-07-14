import React from 'react'

type Bullet = {
  id?: string
  text: string
}

type Props = {
  article: string
  title: string
  bullets?: Bullet[]
  icon?: React.ReactNode
}

export default function PolicyCard({ article, title, bullets = [], icon }: Props) {
  return (
    <div className="
group
bg-[#EAF4FF] dark:bg-[#20222c]
rounded-3xl
p-5
transition-all
duration-300
hover:-translate-y-1
shadow-[-4px_-4px_8px_rgba(255,255,255,0.8),4px_4px_8px_rgba(174,190,205,0.15)]
dark:shadow-[-4px_-4px_8px_rgba(255,255,255,0.04),4px_4px_8px_rgba(0,0,0,0.4)]
">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full border border-[#E6F0FF] dark:border-[#383c4d] bg-[#F8FBFF] dark:bg-[#2a2d3a] text-[#2563EB] dark:text-[#5a9fe8] shrink-0 transition-transform duration-200 group-hover:scale-105">
          {icon ?? <span className="text-lg">ℹ️</span>}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#c6540d] dark:text-[#d99a5b]">{article}</div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">{title}</h4>
            </div>
          </div>

          {bullets.length > 0 && (
            <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-2">
              {bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#2563EB] dark:text-[#5a9fe8] font-semibold text-xs mt-0.5">{idx + 1}.</span>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}