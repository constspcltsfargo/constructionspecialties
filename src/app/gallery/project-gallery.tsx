'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { projectCategories, projects, type ProjectCategory } from '@/lib/projects';
import { ease } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

type Filter = 'All' | ProjectCategory;

function FilterBar({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  const filters: Filter[] = ['All', ...projectCategories];
  const count = (f: Filter) => (f === 'All' ? projects.length : projects.filter((p) => p.category === f).length);

  return (
    <div role="tablist" aria-label="Filter projects" className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
      {filters.map((f) => {
        const active = value === f;
        return (
          <button
            key={f}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(f)}
            className={cn(
              'relative shrink-0 rounded-sm px-4 py-2.5 text-sm transition-colors duration-300',
              active ? 'text-white' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && (
              <motion.span
                layoutId="gallery-filter"
                className="absolute inset-0 rounded-sm bg-ink"
                transition={{ type: 'spring', stiffness: 420, damping: 38 }}
              />
            )}
            <span className="relative">
              {f}
              <span className={cn('ml-2 font-mono text-[0.7rem]', active ? 'text-white/50' : 'text-muted-foreground/60')}>
                {count(f)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: typeof projects;
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const item = items[index];
  const go = useCallback((dir: number) => onIndex((index + dir + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [go, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-white backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="container-x flex h-16 shrink-0 items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <p className="font-mono text-xs text-white/50">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 grid size-10 place-items-center transition-transform hover:rotate-90">
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={item.src}
            className="absolute inset-0 mx-4 sm:mx-20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
          >
            <Image src={item.src} alt={item.title} fill sizes="100vw" className="pointer-events-none select-none object-contain" />
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center border border-white/20 transition-colors hover:bg-white hover:text-ink sm:grid"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center border border-white/20 transition-colors hover:bg-white hover:text-ink sm:grid"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="container-x flex h-20 shrink-0 items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0">
          <p className="truncate font-medium">{item.title}</p>
          <p className="text-sm text-white/50">
            {item.category}
            {item.location && ` · ${item.location}`}
          </p>
        </div>
        <div className="flex sm:hidden">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid size-11 place-items-center border border-white/20">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className="-ml-px grid size-11 place-items-center border border-white/20">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)), [filter]);

  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar value={filter} onChange={setFilter} />
          <p className="eyebrow hidden md:block">Click a photo to enlarge</p>
        </div>

        <motion.ul layout className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((project, i) => (
              <motion.li
                key={project.src}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease, delay: Math.min(i, 8) * 0.03 }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group block w-full text-left"
                  aria-label={`Enlarge photo: ${project.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={project.src}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
                    />
                    <span className="absolute right-3 top-3 grid size-9 scale-75 place-items-center bg-background opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100">
                      <Plus className="size-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-4">
                    <p className="truncate font-medium">{project.title}</p>
                    <p className="eyebrow shrink-0">{project.location ?? project.category}</p>
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} onIndex={setOpenIndex} />
        )}
      </AnimatePresence>
    </section>
  );
}
