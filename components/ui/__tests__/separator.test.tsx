import { render, screen } from '@testing-library/react';
import { Separator } from '../separator';

describe('Separator', () => {
  it('デフォルトの水平セパレーターをレンダリングする', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveClass('shrink-0', 'bg-border', 'h-[1px]', 'w-full');
  });

  it('垂直セパレーターをレンダリングする', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('shrink-0', 'bg-border', 'h-full', 'w-[1px]');
  });

  it('decorativeプロパティのデフォルト値がtrueである', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    // decorative=trueの場合、Radix UIはrole="none"を設定する
    expect(separator).toHaveAttribute('role', 'none');
  });

  it('decorative=falseの場合はseparatorロールが設定される', () => {
    render(<Separator decorative={false} data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-separator-class';
    render(<Separator className={customClass} data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass(customClass);
    expect(separator).toHaveClass('shrink-0', 'bg-border');
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<Separator ref={ref} data-testid="separator" />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(<Separator data-testid="custom-separator" role="separator" />);

    const separator = screen.getByTestId('custom-separator');
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('水平セパレーターの適切なスタイルクラスを持つ', () => {
    render(<Separator orientation="horizontal" data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('h-[1px]', 'w-full');
    expect(separator).not.toHaveClass('h-full', 'w-[1px]');
  });

  it('垂直セパレーターの適切なスタイルクラスを持つ', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('h-full', 'w-[1px]');
    expect(separator).not.toHaveClass('h-[1px]', 'w-full');
  });

  it('セマンティックな分離器として機能する', () => {
    render(
      <div>
        <div>コンテンツ1</div>
        <Separator data-testid="separator" />
        <div>コンテンツ2</div>
      </div>
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('Radix UI Separatorの基本機能を継承する', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    // Radix UIのSeparatorコンポーネントとして機能することを確認
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveAttribute('role', 'none');
  });
});
