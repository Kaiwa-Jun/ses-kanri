import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Switch } from '../switch';

describe('Switch', () => {
  it('デフォルトのスイッチをレンダリングする', () => {
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('role', 'switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('checked状態を適用する', () => {
    render(<Switch checked data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('disabled状態を適用する', () => {
    render(<Switch disabled data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-switch-class';
    render(<Switch className={customClass} data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass(customClass);
  });

  it('ユーザーのクリックでスイッチ状態を切り替える', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onCheckedChange={handleChange} data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');

    await user.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('onCheckedChangeイベントを処理する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onCheckedChange={handleChange} data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    await user.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<Switch ref={ref} data-testid="switch" />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(<Switch data-testid="custom-switch" aria-label="設定切り替え" />);

    const switchElement = screen.getByTestId('custom-switch');
    expect(switchElement).toHaveAttribute('aria-label', '設定切り替え');
  });

  it('フォーカス状態を処理する', async () => {
    const user = userEvent.setup();

    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    await user.tab(); // タブキーでフォーカス

    expect(switchElement).toHaveFocus();
  });

  it('キーボード操作（スペースキー）でスイッチ状態を切り替える', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onCheckedChange={handleChange} data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    switchElement.focus();

    await user.keyboard(' '); // スペースキー

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('キーボード操作（Enterキー）でスイッチ状態を切り替える', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onCheckedChange={handleChange} data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    switchElement.focus();

    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('unchecked状態のスタイルクラスを持つ', () => {
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input');
  });

  it('checked状態のスタイルクラスを持つ', () => {
    render(<Switch checked data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass('data-[state=checked]:bg-primary');
  });

  it('フォーカス時のスタイルクラスを含む', () => {
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    );
  });

  it('Thumbコンポーネントを含む', () => {
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId('switch');
    // Thumbは内部要素として存在する
    expect(switchElement.firstChild).toBeInTheDocument();
  });
});
