import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  it('デフォルトの入力フィールドをレンダリングする', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    // デフォルトではtype属性が明示的に設定されない場合がある
    expect(input.tagName).toBe('INPUT');
  });

  it('指定されたtypeプロパティを適用する', () => {
    render(<Input type="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('passwordタイプの場合は適切にレンダリングする', () => {
    render(<Input type="password" data-testid="password-input" />);

    const input = screen.getByTestId('password-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('placeholderテキストを表示する', () => {
    const placeholderText = 'メールアドレスを入力してください';
    render(<Input placeholder={placeholderText} />);

    const input = screen.getByPlaceholderText(placeholderText);
    expect(input).toBeInTheDocument();
  });

  it('valueプロパティを適用する', () => {
    const value = 'test@example.com';
    render(<Input value={value} readOnly />);

    const input = screen.getByDisplayValue(value);
    expect(input).toBeInTheDocument();
  });

  it('disabled状態を適用する', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-input-class';
    render(<Input className={customClass} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(customClass);
  });

  it('ユーザー入力を処理する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Hello World');
  });

  it('onFocusイベントを処理する', async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();

    render(<Input onFocus={handleFocus} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    expect(handleFocus).toHaveBeenCalled();
  });

  it('onBlurイベントを処理する', async () => {
    const user = userEvent.setup();
    const handleBlur = jest.fn();

    render(<Input onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab(); // フォーカスを外す

    expect(handleBlur).toHaveBeenCalled();
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<Input ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(<Input data-testid="custom-input" maxLength={10} />);

    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('maxLength', '10');
  });
});
