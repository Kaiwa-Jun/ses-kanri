import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('デフォルトのボタンが正しくレンダリングされる', () => {
    render(<Button>テストボタン</Button>);

    const button = screen.getByRole('button', { name: 'テストボタン' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('異なるバリアントが正しく適用される', () => {
    const { rerender } = render(<Button variant="destructive">削除</Button>);

    let button = screen.getByRole('button', { name: '削除' });
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');

    rerender(<Button variant="outline">アウトライン</Button>);
    button = screen.getByRole('button', { name: 'アウトライン' });
    expect(button).toHaveClass('border', 'border-input', 'bg-background');

    rerender(<Button variant="ghost">ゴースト</Button>);
    button = screen.getByRole('button', { name: 'ゴースト' });
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
  });

  it('異なるサイズが正しく適用される', () => {
    const { rerender } = render(<Button size="sm">小さい</Button>);

    let button = screen.getByRole('button', { name: '小さい' });
    expect(button).toHaveClass('h-9', 'px-3');

    rerender(<Button size="lg">大きい</Button>);
    button = screen.getByRole('button', { name: '大きい' });
    expect(button).toHaveClass('h-11', 'px-8');

    rerender(<Button size="icon">アイコン</Button>);
    button = screen.getByRole('button', { name: 'アイコン' });
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('disabled状態が正しく動作する', () => {
    render(<Button disabled>無効化ボタン</Button>);

    const button = screen.getByRole('button', { name: '無効化ボタン' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('クリックイベントが正しく発火する', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>クリック</Button>);

    const button = screen.getByRole('button', { name: 'クリック' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<Button className="custom-class">カスタム</Button>);

    const button = screen.getByRole('button', { name: 'カスタム' });
    expect(button).toHaveClass('custom-class');
  });

  it('asChildプロパティが正しく動作する', () => {
    render(
      <Button asChild>
        <a href="/test">リンクボタン</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'リンクボタン' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});
