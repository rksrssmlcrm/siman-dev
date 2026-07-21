import { ImageResponse } from 'next/og'

export const alt = 'SimanDev — сайты и лендинги под ключ, которые продают'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1830',
          color: '#f5f5fa',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -2,
            backgroundImage:
              'linear-gradient(100deg, #7c3aed 0%, #3b82f6 50%, #22d3ee 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          SimanDev
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            color: '#b9b7c9',
          }}
        >
          Создаём сайты, которые продают
        </div>
      </div>
    ),
    size,
  )
}
