import { brand } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

export function StrongPhraseBlock({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <blockquote
      className={`max-w-3xl border-l-2 border-dotted border-xinergy-orange pl-4 sm:pl-8 ${className}`}
    >
      <p
        className={`${ttForsDisplay.className} brand-phrase leading-snug break-words ${
          compact
            ? "text-lg sm:text-3xl lg:text-xl lg:leading-snug xl:text-2xl"
            : "text-lg sm:text-3xl lg:text-[2.125rem] lg:leading-snug"
        }`}
      >
        <span className="font-bold">{brand.strongPhrase.lead}</span>
        <br />
        <span className="text-xinergy-orange">{brand.strongPhrase.highlight}</span>
        <br />
        <span className="font-normal text-white/90">{brand.strongPhrase.body}</span>
      </p>
    </blockquote>
  );
}
