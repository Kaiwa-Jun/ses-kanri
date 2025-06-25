import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Badge } from '../badge';

describe('Badge', () => {
  it('デフォルトのバッジが正しく表示される', () => {
    render(<Badge>デフォルト</Badge>);

    const badge = screen.getByText('デフォルト');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
  });

  it('secondaryバリアントが正しく適用される', () => {
    render(<Badge variant="secondary">セカンダリ</Badge>);

    const badge = screen.getByText('セカンダリ');
    expect(badge).toHaveClass('bg-secondary');
  });

  it('destructiveバリアントが正しく適用される', () => {
    render(<Badge variant="destructive">削除</Badge>);

    const badge = screen.getByText('削除');
    expect(badge).toHaveClass('bg-destructive');
  });

  it('outlineバリアントが正しく適用される', () => {
    render(<Badge variant="outline">アウトライン</Badge>);

    const badge = screen.getByText('アウトライン');
    expect(badge).toHaveClass('border');
  });

  it('カスタムクラス名が適用される', () => {
    render(<Badge className="custom-class">カスタム</Badge>);

    const badge = screen.getByText('カスタム');
    expect(badge).toHaveClass('custom-class');
  });

  it('子要素が正しく表示される', () => {
    render(
      <Badge>
        <span>内部要素</span>
      </Badge>
    );

    const innerElement = screen.getByText('内部要素');
    expect(innerElement).toBeInTheDocument();
  });
});
