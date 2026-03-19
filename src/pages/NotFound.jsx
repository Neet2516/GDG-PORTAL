/**
 * Not found page
 */

import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <section className="px-4 pb-16 pt-36">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-surface-container-low p-8 text-center md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">404</p>
        <h1 className="mt-4 text-5xl font-extrabold md:text-6xl">Route not found</h1>
        <p className="mt-4 text-base leading-7 text-on-surface-variant">
          The page you requested does not exist in this registration flow.
        </p>
        <Link
          to="/"
          className="primary-gradient mt-8 inline-flex rounded-xl px-6 py-3 font-manrope font-semibold text-on-primary shadow-[0_24px_50px_-24px_rgba(0,88,189,0.55)]"
        >
          Return home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
