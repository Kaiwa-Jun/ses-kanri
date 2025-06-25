import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('デフォルトのスケルトンが正しく表示される', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('カスタムクラス名が適用される', () => {
    render(<Skeleton className="custom-skeleton-class" data-testid="custom-skeleton" />);

    const skeleton = screen.getByTestId('custom-skeleton');
    expect(skeleton).toHaveClass('custom-skeleton-class');
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('カスタムサイズのスケルトンが正しく表示される', () => {
    render(<Skeleton className="h-4 w-48" data-testid="sized-skeleton" />);

    const skeleton = screen.getByTestId('sized-skeleton');
    expect(skeleton).toHaveClass('h-4', 'w-48');
  });

  it('複数のスケルトンが正しく表示される', () => {
    render(
      <div>
        <Skeleton data-testid="skeleton-1" className="h-6 w-32 mb-2" />
        <Skeleton data-testid="skeleton-2" className="h-4 w-24 mb-2" />
        <Skeleton data-testid="skeleton-3" className="h-8 w-64" />
      </div>
    );

    expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-2')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-3')).toBeInTheDocument();
  });

  it('HTML属性が正しく適用される', () => {
    render(<Skeleton data-testid="attr-skeleton" role="status" aria-label="読み込み中" />);

    const skeleton = screen.getByTestId('attr-skeleton');
    expect(skeleton).toHaveAttribute('role', 'status');
    expect(skeleton).toHaveAttribute('aria-label', '読み込み中');
  });
});
