export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#6C63FF]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6C63FF] animate-spin" />
          <div className="absolute inset-2 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#8c84ff]">mp</span>
          </div>
        </div>
        <p className="text-xs text-white/30 tracking-widest uppercase animate-pulse">Loading</p>
      </div>
    </div>
  )
}
