import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50'
  const variants = {
    primary: 'bg-[#6C63FF] text-white hover:opacity-90',
    ghost: 'border border-gray-700 text-gray-300 hover:border-gray-500',
    danger: 'border border-red-900 text-red-400 hover:border-red-600',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
