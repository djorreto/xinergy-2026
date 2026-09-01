const LAYERS = 20;

/** 5 extruido en CSS 3D — se orbita con el mouse. */
export function FiveSculpture({ active }: { active: boolean }) {
  return (
    <div className={`anniv-sculpt ${active ? "is-on" : ""}`} aria-hidden>
      <div className="anniv-sculpt__inner">
        {Array.from({ length: LAYERS }, (_, i) => (
          <span
            key={i}
            className="anniv-sculpt__layer font-display"
            style={{
              transform: `translate(-50%, -50%) translateZ(${-i * 8}px)`,
              color:
                i === 0
                  ? "#fca100"
                  : `rgba(252, 161, 0, ${Math.max(0.035, 0.42 - i * 0.02)})`,
              filter: i === 0 ? "drop-shadow(0 0 28px rgba(252,161,0,0.55))" : undefined,
            }}
          >
            5
          </span>
        ))}
      </div>
    </div>
  );
}
