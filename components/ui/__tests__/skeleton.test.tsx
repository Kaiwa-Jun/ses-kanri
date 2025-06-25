import { render, screen } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('デフォルトのスケルトンをレンダリングする', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-skeleton-class';
    render(<Skeleton className={customClass} data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass(customClass);
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('HTML属性を適用する', () => {
    render(<Skeleton data-testid="custom-skeleton" style={{ width: '100px', height: '20px' }} />);

    const skeleton = screen.getByTestId('custom-skeleton');
    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' });
  });

  it('子要素を正しく表示する', () => {
    render(<Skeleton data-testid="skeleton">読み込み中...</Skeleton>);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveTextContent('読み込み中...');
  });

  it('divタグとしてレンダリングされる', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.tagName).toBe('DIV');
  });

  it('複数のスケルトンを同時にレンダリングできる', () => {
    render(
      <div>
        <Skeleton data-testid="skeleton-1" />
        <Skeleton data-testid="skeleton-2" />
        <Skeleton data-testid="skeleton-3" />
      </div>
    );

    expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-2')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-3')).toBeInTheDocument();
  });

  it('異なるサイズのスケルトンを作成できる', () => {
    render(
      <div>
        <Skeleton className="h-4 w-full" data-testid="skeleton-line" />
        <Skeleton className="h-12 w-12 rounded-full" data-testid="skeleton-avatar" />
        <Skeleton className="h-32 w-full" data-testid="skeleton-card" />
      </div>
    );

    const skeletonLine = screen.getByTestId('skeleton-line');
    const skeletonAvatar = screen.getByTestId('skeleton-avatar');
    const skeletonCard = screen.getByTestId('skeleton-card');

    expect(skeletonLine).toHaveClass('h-4', 'w-full');
    expect(skeletonAvatar).toHaveClass('h-12', 'w-12', 'rounded-full');
    expect(skeletonCard).toHaveClass('h-32', 'w-full');
  });
});
