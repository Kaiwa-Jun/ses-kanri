import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('デフォルトのバッジが正しくレンダリングされる', () => {
    render(<Badge>デフォルト</Badge>);

    const badge = screen.getByText('デフォルト');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('異なるバリアントが正しく適用される', () => {
    const { rerender } = render(<Badge variant="secondary">セカンダリ</Badge>);

    let badge = screen.getByText('セカンダリ');
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');

    rerender(<Badge variant="destructive">削除</Badge>);
    badge = screen.getByText('削除');
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground');

    rerender(<Badge variant="outline">アウトライン</Badge>);
    badge = screen.getByText('アウトライン');
    expect(badge).toHaveClass('text-foreground');
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<Badge className="custom-badge">カスタム</Badge>);

    const badge = screen.getByText('カスタム');
    expect(badge).toHaveClass('custom-badge');
  });

  it('基本的なスタイルが適用される', () => {
    render(<Badge>テスト</Badge>);

    const badge = screen.getByText('テスト');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold'
    );
  });

  it('子要素が正しく表示される', () => {
    render(
      <Badge>
        <span>アイコン</span>
        テキスト
      </Badge>
    );

    expect(screen.getByText('アイコン')).toBeInTheDocument();
    expect(screen.getByText('テキスト')).toBeInTheDocument();
  });
});
