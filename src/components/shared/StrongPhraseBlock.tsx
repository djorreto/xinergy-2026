import { brand } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

export function StrongPhraseBlock({ className = "" }: { className?: string }) {
  return (
    <blockquote
      className={`max-w-3xl border-l-2 border-dotted border-xinergy-orange pl-4 sm:pl-8 ${className}`}
    >
      <p
        className={`${ttForsDisplay.className} brand-phrase text-lg leading-snug break-words sm:text-3xl lg:text-[2.125rem] lg:leading-snug`}
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
