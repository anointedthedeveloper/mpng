export default function EditorLoading() {
  return (
    <div className="min-h-screen bg-[#080810] grid lg:grid-cols-[22rem_1fr]">
      {/* Sidebar skeleton */}
      <aside className="border-r border-white/8 bg-[#0a0a14] flex flex-col gap-0">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="w-16 h-3 rounded bg-white/5 animate-pulse" />
              <div className="w-10 h-2 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
        </div>
        <div className="px-5 py-6 flex flex-col gap-4">
          <div className="h-16 rounded-2xl bg-white/[0.03] animate-pulse" />
          <div className="h-32 rounded-2xl bg-white/[0.03] animate-pulse" />
          <div className="h-10 rounded-xl bg-white/[0.03] animate-pulse" />
          <div className="h-10 rounded-xl bg-white/[0.03] animate-pulse" />
          <div className="h-10 rounded-xl bg-white/[0.03] animate-pulse" />
        </div>
      </aside>

      {/* Canvas skeleton */}
      <section className="bg-[#060810] flex flex-col">
        <div className="border-b border-white/8 px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="w-32 h-4 rounded bg-white/5 animate-pulse" />
            <div className="w-48 h-3 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/5 animate-pulse" />
            <div className="w-40 h-4 rounded bg-white/5 animate-pulse" />
            <div className="w-56 h-3 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  )
}
