import { AnimatePresence, motion } from 'framer-motion';

export default function EventFeed({ events }) {
  return (
    <aside className="event-feed" aria-live="polite">
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.p key={event.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }}>
            {event.message}
          </motion.p>
        ))}
      </AnimatePresence>
    </aside>
  );
}
