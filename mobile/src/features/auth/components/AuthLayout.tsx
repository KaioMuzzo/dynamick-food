import { type ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BrandLogo from '@/assets/brand/brand-logo.svg'

const backgroundSource = require('@/assets/brand/welcome-background.jpg')

// Decorative "speed line" strokes from the design (Figma: azul-detalhes lines).
// Positions match the 375px-wide reference frame; nudged down so the topmost
// stroke clears the "D" of the title.
const SPEED_LINES_OFFSET_Y = 24

const SPEED_LINES = [
  { left: 340, top: 117, opacity: 1 },
  { left: 315, top: 131, opacity: 0.6 },
  { left: 351, top: 147, opacity: 1 },
  { left: 340, top: 170, opacity: 0.6 },
  { left: 308, top: 196, opacity: 1 },
  { left: 358, top: 203, opacity: 0.6 },
  { left: 343, top: 222, opacity: 1 },
  { left: 319, top: 227, opacity: 0.8 },
]

function SpeedLines() {
  return (
    <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
      {SPEED_LINES.map((line) => (
        <View
          key={`${line.left}-${line.top}`}
          className="absolute h-px w-[114px] bg-accent-blue"
          style={{
            left: line.left,
            top: line.top + SPEED_LINES_OFFSET_Y,
            opacity: line.opacity,
            transform: [{ rotate: '-167.91deg' }],
          }}
        />
      ))}
    </View>
  )
}

/**
 * Shared chrome for the auth screens (Welcome, Login, Forgot password):
 * full-bleed background photo, decorative speed lines, brand header, and a
 * bottom-anchored dark card. Each screen supplies the card content as children.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-surface-dark">
      <Image source={backgroundSource} contentFit="cover" style={StyleSheet.absoluteFill} />

      <SpeedLines />

      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="items-center pt-6">
          <BrandLogo width={140} height={140} />
          <Text className="font-poppins-extrabold-italic text-[36px] text-accent-blue">
            Dynamick Food
          </Text>
          <Text className="mt-2 font-poppins-medium text-[16px] text-accent-blue">
            Valorizando o Trabalhador
          </Text>
        </View>

        <View className="flex-1" />

        <View
          className="mx-6 rounded-t-[18px] border border-b-0 border-card-border bg-surface-card px-6 pt-6"
          style={{ paddingBottom: insets.bottom + 40 }}
        >
          {children}
        </View>
      </View>
    </View>
  )
}
