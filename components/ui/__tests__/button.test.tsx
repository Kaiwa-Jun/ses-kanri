import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from '../button';

describe('Button', () => {
  it('デフォルトのボタンが正しく表示される', () => {
    render(<Button>クリック</Button>);

    const button = screen.getByRole('button', { name: 'クリック' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('variantプロパティが正しく適用される', () => {
    render(<Button variant="secondary">セカンダリ</Button>);

    const button = screen.getByRole('button', { name: 'セカンダリ' });
    expect(button).toHaveClass('bg-secondary');
  });

  it('sizeプロパティが正しく適用される', () => {
    render(<Button size="sm">小さいボタン</Button>);

    const button = screen.getByRole('button', { name: '小さいボタン' });
    expect(button).toHaveClass('h-9');
  });

  it('disabledプロパティが正しく動作する', () => {
    render(<Button disabled>無効ボタン</Button>);

    const button = screen.getByRole('button', { name: '無効ボタン' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
  });

  it('クリックイベントが正しく発火する', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>クリック可能</Button>);

    const button = screen.getByRole('button', { name: 'クリック可能' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('asChildプロパティでリンクとして表示される', () => {
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
