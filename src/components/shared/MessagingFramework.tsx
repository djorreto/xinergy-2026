import { messaging } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

export function MessagingFramework({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto] ${className}`}
    >
      {(["why", "what", "how"] as const).map((key) => {
        const block = messaging[key];
        return (
          <article
            key={key}
            className="grid gap-4 rounded-2xl border border-xinergy-charcoal/10 bg-white p-6 lg:row-span-2 lg:grid-rows-subgrid"
          >
            <div className="flex flex-col">
              <h3
                className={`${ttForsDisplay.className} text-2xl font-semibold leading-tight text-xinergy-charcoal lg:text-[1.75rem]`}
              >
                {block.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">
                {block.intro}
              </p>
            </div>
            <ul className="space-y-2.5 border-t border-xinergy-charcoal/8 pt-4">
              {block.points.map((point, i) => (
                <li key={point} className="flex gap-3 text-sm leading-snug text-xinergy-slate">
                  <span
                    className={`${ttForsDisplay.className} w-7 flex-shrink-0 text-sm font-medium text-xinergy-orange`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
