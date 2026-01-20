import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Icon generation function
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
          borderRadius: '50%',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House shape */}
          <path
            d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z"
            fill="white"
          />
          {/* Roof */}
          <path
            d="M 25 45 L 50 25 L 75 45"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Door */}
          <rect
            x="44"
            y="55"
            width="12"
            height="15"
            fill="#2563eb"
            rx="1"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
