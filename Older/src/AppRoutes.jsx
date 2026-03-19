import React, { Suspense, lazy, useRef } from "react";
import Hero from "./Pages/Hero";

const InfoSection = lazy(() => import("./Pages/InfoSection"));
const RegistrationForm = lazy(() => import("./Pages/RegistrationForm"));

const AppRoutes = () => {
    const registerRef = useRef(null);

    const scrollToRegister = () => {
        registerRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen overflow-x-hidden selection:bg-[indigo-500] selection:text-white">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10">
                <main>
                    <Hero onCtaClick={scrollToRegister} />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-24">
                        <Suspense
                            fallback={
                                <div className="h-48 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                            }
                        >
                            <InfoSection />
                        </Suspense>

                        <div
                            id="register-section"
                            ref={registerRef}
                            className="pt-16"
                        >
                            <Suspense
                                fallback={
                                    <div className="h-[32rem] rounded-3xl border border-white/10 bg-white/5 animate-pulse" />
                                }
                            >
                                <RegistrationForm />
                            </Suspense>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppRoutes;
