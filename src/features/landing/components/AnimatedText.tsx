/* [UI:TEXT] Letter-by-letter animated heading. */

import type { CSSProperties } from "react";

type AnimatedTextProps = {
  text: string;
  className?: string;
  id?: string;
};

export function AnimatedText({ text, className, id }: AnimatedTextProps) {
  return (
    <h1 id={id} className={className}>
      {text.split("").map((character, index) => (
        <span
          key={`${character}-${index}`}
          className="letter-reveal"
          style={{ "--i": index, "--total": text.length } as CSSProperties}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </h1>
  );
}
