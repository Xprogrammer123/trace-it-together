import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function getDeliveryMessage(deliveryDate: string): string {
  const today = new Date();
  const delivery = new Date(deliveryDate);
  
  // Reset time part for accurate day comparison
  today.setHours(0, 0, 0, 0);
  delivery.setHours(0, 0, 0, 0);
  
  const diffTime = delivery.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return "Package was due for delivery";
  } else if (diffDays === 0) {
    return "Your package will arrive today";
  } else if (diffDays === 1) {
    return "Your package will arrive tomorrow";
  } else {
    return `Your package will arrive in ${diffDays} days`;
  }
}
