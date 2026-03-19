import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <p className="text-sm font-semibold tracking-widest text-indigo-500">404 ERROR</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-gray-300">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl px-5 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
