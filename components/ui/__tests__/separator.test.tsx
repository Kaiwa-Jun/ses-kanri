import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Separator } from '../separator';

describe('Separator', () => {
  it('デフォルトの水平セパレーターが正しく表示される', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('shrink-0', 'bg-border', 'h-[1px]', 'w-full');
  });

  it('垂直セパレーターが正しく表示される', () => {
    render(<Separator orientation="vertical" data-testid="vertical-separator" />);

    const separator = screen.getByTestId('vertical-separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('h-full', 'w-[1px]');
  });

  it('decorative属性が正しく適用される', () => {
    render(<Separator decorative data-testid="decorative-separator" />);

    const separator = screen.getByTestId('decorative-separator');
    expect(separator).toBeInTheDocument();
  });

  it('カスタムクラス名が適用される', () => {
    render(<Separator className="custom-separator-class" data-testid="custom-separator" />);

    const separator = screen.getByTestId('custom-separator');
    expect(separator).toHaveClass('custom-separator-class');
  });

  it('ref が正しく渡される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} data-testid="ref-separator" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('水平と垂直の方向性クラスが正しく適用される', () => {
    const { rerender } = render(
      <Separator orientation="horizontal" data-testid="test-separator" />
    );

    let separator = screen.getByTestId('test-separator');
    expect(separator).toHaveClass('h-[1px]', 'w-full');

    rerender(<Separator orientation="vertical" data-testid="test-separator" />);

    separator = screen.getByTestId('test-separator');
    expect(separator).toHaveClass('h-full', 'w-[1px]');
  });
});
