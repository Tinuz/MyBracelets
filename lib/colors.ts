// Utility function to map color names to Tailwind CSS classes
export function getColorClass(colorName: string): string {
  const color = colorName.toUpperCase();
  
  const colorMap: Record<string, string> = {
    // Basic colors
    'RED': 'bg-red-500',
    'BLUE': 'bg-blue-500',
    'GREEN': 'bg-green-500',
    'YELLOW': 'bg-yellow-500',
    'PURPLE': 'bg-purple-500',
    'ORANGE': 'bg-orange-500',
    'PINK': 'bg-pink-500',
    'BLACK': 'bg-black',
    'WHITE': 'bg-white border-gray-300',
    'GRAY': 'bg-gray-500',
    'GREY': 'bg-gray-500',
    
    // Metals
    'GOLD': 'bg-yellow-400',
    'SILVER': 'bg-gray-300',
    'BRONZE': 'bg-yellow-600',
    'COPPER': 'bg-orange-600',
    
    // Extended colors
    'TURQUOISE': 'bg-teal-400',
    'MAROON': 'bg-red-800',
    'LIME': 'bg-lime-400',
    'NAVY': 'bg-blue-900',
    'TEAL': 'bg-teal-500',
    'INDIGO': 'bg-indigo-500',
    'VIOLET': 'bg-violet-500',
    'MAGENTA': 'bg-fuchsia-500',
    'CYAN': 'bg-cyan-500',
    'CRIMSON': 'bg-red-600',
    'EMERALD': 'bg-emerald-500',
    'AMBER': 'bg-amber-400',
    'ROSE': 'bg-rose-400',
    'MINT': 'bg-green-300',
    'LAVENDER': 'bg-purple-300',
    'PEACH': 'bg-orange-300',
    'CORAL': 'bg-coral-400',
    'SALMON': 'bg-orange-400',
    
    // Darker variants
    'DARK_BLUE': 'bg-blue-800',
    'DARK_GREEN': 'bg-green-800',
    'DARK_RED': 'bg-red-800',
    'DARK_PURPLE': 'bg-purple-800',
    
    // Lighter variants
    'LIGHT_BLUE': 'bg-blue-300',
    'LIGHT_GREEN': 'bg-green-300',
    'LIGHT_PINK': 'bg-pink-300',
    'LIGHT_YELLOW': 'bg-yellow-300',
    
    // Fallback for unknown colors
    'UNKNOWN': 'bg-gray-400'
  };
  
  return colorMap[color] || 'bg-gray-400';
}

// For cart display - simplified color mapping
export function getCartColorClass(colorName: string): string {
  const color = colorName.toUpperCase();
  
  switch (color) {
    case 'RED': return 'bg-red-500';
    case 'BLUE': return 'bg-blue-500';
    case 'YELLOW': return 'bg-yellow-500';
    case 'GREEN': return 'bg-green-500';
    case 'GOLD': return 'bg-yellow-400';
    default: return 'bg-gray-500';
  }
}