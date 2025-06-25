import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Label } from '../label';

describe('Label', () => {
  it('デフォルトのラベルが正しく表示される', () => {
    render(<Label>ラベルテキスト</Label>);

    const label = screen.getByText('ラベルテキスト');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('htmlFor属性が正しく適用される', () => {
    render(<Label htmlFor="test-input">入力用ラベル</Label>);

    const label = screen.getByText('入力用ラベル');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('カスタムクラス名が適用される', () => {
    render(<Label className="custom-label-class">カスタムラベル</Label>);

    const label = screen.getByText('カスタムラベル');
    expect(label).toHaveClass('custom-label-class');
  });

  it('無効状態でのスタイルが適用される', () => {
    render(
      <Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        無効ラベル
      </Label>
    );

    const label = screen.getByText('無効ラベル');
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
    expect(label).toHaveClass('peer-disabled:opacity-70');
  });

  it('子要素が正しく表示される', () => {
    render(
      <Label>
        <span>ラベル内要素</span>
      </Label>
    );

    const innerElement = screen.getByText('ラベル内要素');
    expect(innerElement).toBeInTheDocument();
  });

  it('ref が正しく渡される', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>ref テスト</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
