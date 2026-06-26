import { FEATURE_LABELS } from '@/types'
import { Snowflake, Bluetooth, Navigation, Camera, Sun, Flame, Zap, ParkingSquare, Gauge } from 'lucide-react'

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  climatisation: <Snowflake className="w-3 h-3" />,
  bluetooth: <Bluetooth className="w-3 h-3" />,
  gps: <Navigation className="w-3 h-3" />,
  camera_recul: <Camera className="w-3 h-3" />,
  camera_360: <Camera className="w-3 h-3" />,
  toit_ouvrant: <Sun className="w-3 h-3" />,
  sieges_chauffants: <Flame className="w-3 h-3" />,
  abs: <Gauge className="w-3 h-3" />,
  esp: <Zap className="w-3 h-3" />,
  aide_stationnement: <ParkingSquare className="w-3 h-3" />,
}

interface Props {
  feature: string
}

export default function CarFeatureBadge({ feature }: Props) {
  const label = FEATURE_LABELS[feature] ?? feature
  const icon = FEATURE_ICONS[feature]

  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
      {icon}
      {label}
    </span>
  )
}
