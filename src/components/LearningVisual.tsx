import type { LearningVisual as LearningVisualData, Grade } from '../data/curriculum';

type LearningVisualProps = {
  visual: LearningVisualData;
  grade?: Grade;
  compact?: boolean;
};

const renderShape = (shape: NonNullable<LearningVisualData['groups'][number]['items'][number]['shape']>) => {
  const paths = {
    circle: <circle cx="50" cy="50" r="42" />,
    square: <rect x="10" y="10" width="80" height="80" rx="3" />,
    triangle: <path d="M50 8 94 88H6Z" />,
    rectangle: <rect x="6" y="22" width="88" height="56" rx="3" />,
  };
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {paths[shape]}
    </svg>
  );
};

export function LearningVisual({ visual, grade, compact = false }: LearningVisualProps) {
  return (
    <div
      className={`learning-visual${compact ? ' compact' : ''}`}
      data-grade={grade}
      role="img"
      aria-label={visual.alt}
    >
      {visual.src && (
        <img
          className="learning-visual-image"
          src={visual.src}
          alt={visual.alt}
          onError={event => { event.currentTarget.hidden = true; }}
        />
      )}
      {(visual.groups ?? []).map((group, groupIndex) => (
        <div className="learning-visual-group" key={`${group.label}-${groupIndex}`}>
          {group.label && <strong>{group.label}</strong>}
          <div className="learning-visual-items">
            {group.items.map((item, itemIndex) => (
              <span
                className="learning-visual-item"
                data-colour={item.colour}
                data-length={item.length}
                data-size={item.size}
                data-removed={item.removed}
                key={`${item.label}-${itemIndex}`}
              >
                {item.count && item.count > 1 ? (
                  <span className="learning-visual-count" aria-hidden="true">
                    {Array.from({ length: Math.min(item.count, 20) }, (_, countIndex) => (
                      <span className={item.shape ? 'learning-visual-shape' : ''} data-shape={item.shape} key={countIndex}>
                        {item.shape ? renderShape(item.shape) : item.symbol}
                      </span>
                    ))}
                  </span>
                ) : item.shape ? (
                  <span className="learning-visual-shape" aria-hidden="true" data-shape={item.shape}>
                    {renderShape(item.shape)}
                  </span>
                ) : (
                  <span className="learning-visual-symbol" aria-hidden="true">{item.symbol}</span>
                )}
                <small>{item.label}</small>
              </span>
            ))}
          </div>
        </div>
      ))}
      {visual.caption && <span className="learning-visual-caption">{visual.caption}</span>}
      {visual.explanation && <span className="learning-visual-explanation">{visual.explanation}</span>}
    </div>
  );
}