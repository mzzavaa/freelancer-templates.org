// src/remotion/Sims4/components/IconMapper.tsx
// Maps icon string identifiers to Lucide React components

import React from 'react';
import {
  Palette,
  Trophy,
  BookOpen,
  Music,
  Laptop,
  Star,
  Home,
  Coins,
  Heart,
  Brain,
  Gamepad2,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  palette: Palette,
  trophy: Trophy,
  'book-open': BookOpen,
  music: Music,
  laptop: Laptop,
  star: Star,
  home: Home,
  coins: Coins,
  heart: Heart,
  brain: Brain,
  'gamepad-2': Gamepad2,
};

interface IconMapperProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export const IconMapper: React.FC<IconMapperProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className,
}) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <span>{name}</span>;
  }
  return <IconComponent size={size} color={color} className={className} />;
};
