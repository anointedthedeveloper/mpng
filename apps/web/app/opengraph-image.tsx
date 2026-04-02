import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(135deg, #080810 0%, #101126 55%, #1a1140 100%)',
          color: 'white',
          fontFamily: 'Inter, Arial, sans-serif',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-120px -80px auto auto',
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(108,99,255,0.65), rgba(108,99,255,0) 70%)',
            filter: 'blur(10px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 'auto auto -140px -100px',
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(236,72,153,0.42), rgba(236,72,153,0) 70%)',
            filter: 'blur(8px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            opacity: 0.12,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 64, width: '100%', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #6C63FF, #8b5cf6)',
                boxShadow: '0 24px 80px rgba(108,99,255,0.35)',
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              mp
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>
                mp<span style={{ color: '#8c84ff' }}>ng</span>
              </div>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)' }}>Free AI image and video editor online</div>
            </div>
          </div>

          <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                width: 'fit-content',
                gap: 10,
                padding: '10px 16px',
                borderRadius: 9999,
                background: 'rgba(108,99,255,0.14)',
                border: '1px solid rgba(108,99,255,0.3)',
                color: '#d7d4ff',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Browser image editor, PNG export, and no install editor
            </div>
            <div style={{ fontSize: 72, lineHeight: 0.98, fontWeight: 900, letterSpacing: '-0.06em' }}>
              Edit images and video with AI
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.4, color: 'rgba(255,255,255,0.7)', maxWidth: 920 }}>
              Remove backgrounds, blur background, change colors, crop, upscale, and trim clips right in the browser.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {['20+ tools', '0 cost', '100% browser', 'PNG friendly'].map((label) => (
              <div
                key={label}
                style={{
                  padding: '14px 18px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  )
}
