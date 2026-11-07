import type { ReactNode } from 'react'

type FeatureCardProps = {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
      <div className="mb-4 grid size-10 place-items-center rounded-xl bg-[#a5d6b2] text-[#173c36]">
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <p className="mt-1.5 text-xs leading-5 text-[#b8c9c1]">{description}</p>
    </article>
  )
}
