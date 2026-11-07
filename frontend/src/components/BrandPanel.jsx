export default function BrandPanel({ children, className = "" }) {
    const handlePointerMove = (event) => {
        if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
        event.currentTarget.style.setProperty("--pointer-x", `${x}px`);
        event.currentTarget.style.setProperty("--pointer-y", `${y}px`);
    };

    const resetPointer = (event) => {
        event.currentTarget.style.setProperty("--pointer-x", "0px");
        event.currentTarget.style.setProperty("--pointer-y", "0px");
    };

    return (
        <section
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            className={`auth-brand-panel relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-ink px-7 py-7 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-12 ${className}`}
        >
            <div aria-hidden="true" className="auth-parallax auth-parallax--far absolute -right-28 -top-36 h-[28rem] w-[28rem] rounded-full border border-white/10" />
            <div aria-hidden="true" className="auth-parallax auth-parallax--near absolute -right-8 -top-16 h-[20rem] w-[20rem] rounded-full border border-white/10" />
            <div aria-hidden="true" className="auth-parallax auth-parallax--near absolute -right-20 top-24 h-72 w-72 rotate-[12deg] rounded-[3rem] border border-brand/60" />
            {children}
        </section>
    );
}
