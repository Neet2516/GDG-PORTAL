/**
 * Event details section
 */

import { motion } from 'framer-motion';
import { Card, CodeChip } from '../components';

const features = [
  ['Expert speakers', 'Learn from practitioners shipping production systems and platform products.'],
  ['Hands-on workshops', 'Move past theory with practical sessions oriented around modern developer workflows.'],
  ['Community rooms', 'Meet peers, organizers, and mentors across tracks without the usual conference noise.'],
  ['Launch-stage energy', 'A portal and on-site experience designed with the same care as the talks.'],
];

export const EventDetails = () => {
  return (
    <section id="event-details" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-surface-container-low px-6 py-10 md:px-10 md:py-14">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <CodeChip>editorial brief</CodeChip>
            <h2 className="max-w-2xl text-balance text-3xl font-extrabold md:text-5xl">
              Built to feel less like a form and more like admission to a carefully run developer gathering.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-on-surface-variant md:text-right">
            The experience relies on tonal layering, spacious rhythm, and metadata-first presentation instead of borders and boxes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map(([title, description], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Card clickable className="h-full bg-surface-container-lowest">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Track 0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">{description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
