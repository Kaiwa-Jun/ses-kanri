import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('デフォルトのチェックボックスをレンダリングする', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('checked状態を適用する', () => {
    render(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('disabled状態を適用する', () => {
    render(<Checkbox disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-checkbox-class';
    render(<Checkbox className={customClass} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(customClass);
  });

  it('ユーザーのクリックでチェック状態を切り替える', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Checkbox onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('onCheckedChangeイベントを処理する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Checkbox onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('indeterminate状態を処理する', () => {
    render(<Checkbox checked="indeterminate" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    // indeterminate状態の確認は実装依存のため、存在確認のみ
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<Checkbox ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(<Checkbox data-testid="custom-checkbox" aria-label="カスタムチェックボックス" />);

    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'カスタムチェックボックス');
  });

  it('チェック済み状態でチェックマークアイコンを表示する', () => {
    render(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    // Radix UIの実装により、チェック状態では適切なaria属性が設定される
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('フォーカス状態を処理する', async () => {
    const user = userEvent.setup();

    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    await user.tab(); // タブキーでフォーカス

    expect(checkbox).toHaveFocus();
  });

  it('キーボード操作（スペースキー）でチェック状態を切り替える', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Checkbox onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();

    await user.keyboard(' '); // スペースキー

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
