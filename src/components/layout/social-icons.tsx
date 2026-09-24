import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { socialLinks } from '@/lib/site';
import { cn } from '@/lib/utils';

const icons = { Facebook, Twitter, Instagram, LinkedIn: Linkedin, YouTube: Youtube };

export function SocialIcons({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      {socialLinks.map(({ href, label }) => {
        const Icon = icons[label];
        return (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-primary"
          >
            <Icon className={cn('size-4', iconClassName)} aria-hidden />
          </a>
        );
      })}
    </div>
  );
}
