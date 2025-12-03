export default function TrophyBadge({ position }) {
  const badges = {
    1: {
      icon: '🏆',
      bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      text: 'text-amber-900',
      ring: 'ring-yellow-300',
      label: '1st',
    },
    2: {
      icon: '🥈',
      bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
      text: 'text-gray-700',
      ring: 'ring-gray-300',
      label: '2nd',
    },
    3: {
      icon: '🥉',
      bg: 'bg-gradient-to-br from-amber-600 to-amber-700',
      text: 'text-amber-100',
      ring: 'ring-amber-400',
      label: '3rd',
    },
  }

  const badge = badges[position]

  if (!badge) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-500/20 text-gray-500 text-xs font-bold">
        {position}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${badge.bg} ring-2 ${badge.ring} shadow-md`}
      title={`${badge.label} Place`}
    >
      <span className="text-lg">{badge.icon}</span>
    </span>
  )
}

