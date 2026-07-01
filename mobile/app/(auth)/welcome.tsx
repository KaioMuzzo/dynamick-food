import { type ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AuthLayout } from '@/src/features/auth/components/AuthLayout'

// Figma: amarelo-claro-detalhes / token accent-yellow-soft. Icon color props take a
// raw string, not a NativeWind class, so the token value is referenced here directly.
const ROLE_ICON_COLOR = '#ffdb6f'

// Navigation is a no-op until the target screens exist. Once `login`,
// `register/driver` and `register/client` are added to the (auth) group, wire
// these with `useRouter().push(...)` — typedRoutes will then accept the hrefs.

function RoleButton({
  icon,
  label,
  onPress,
}: {
  icon: ReactNode
  label: string
  onPress?: () => void
}) {
  return (
    <Pressable onPress={onPress} className="flex-1 items-center gap-1">
      {icon}
      <Text className="font-poppins-medium text-[12px] text-white">{label}</Text>
      <Text className="font-poppins-medium text-[8px] uppercase text-text-muted">
        Faça seu cadastro
      </Text>
    </Pressable>
  )
}

export default function WelcomeScreen() {
  return (
    <AuthLayout>
      <Text className="font-poppins-medium text-[14px] text-text-muted">Seja bem-vindo!</Text>

      {/* TODO: push('/login') once the login screen exists */}
      <Pressable className="mt-5 w-full rounded-[18px] bg-accent-blue-dark py-3">
        <Text className="text-center font-poppins-medium text-[14px] text-white">
          Acessar sua Conta
        </Text>
      </Pressable>

      <View className="mt-8 flex-row justify-between gap-4">
        {/* TODO: push('/register/driver') once the driver register screen exists */}
        <RoleButton
          icon={<MaterialCommunityIcons name="motorbike" size={28} color={ROLE_ICON_COLOR} />}
          label="SOU ENTREGADOR"
        />
        {/* TODO: push('/register/client') once the client register screen exists */}
        <RoleButton
          icon={<MaterialCommunityIcons name="storefront-outline" size={28} color={ROLE_ICON_COLOR} />}
          label="SOU CLIENTE"
        />
      </View>
    </AuthLayout>
  )
}
