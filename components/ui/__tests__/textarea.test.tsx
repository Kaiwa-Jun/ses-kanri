import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../textarea';

describe('Textarea', () => {
  it('デフォルトのテキストエリアをレンダリングする', () => {
    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveClass('flex', 'min-h-[80px]', 'w-full', 'rounded-md', 'border');
  });

  it('placeholderテキストを表示する', () => {
    const placeholderText = 'コメントを入力してください';
    render(<Textarea placeholder={placeholderText} />);

    const textarea = screen.getByPlaceholderText(placeholderText);
    expect(textarea).toBeInTheDocument();
  });

  it('valueプロパティを適用する', () => {
    const value = 'テストコンテンツ';
    render(<Textarea value={value} readOnly />);

    const textarea = screen.getByDisplayValue(value);
    expect(textarea).toBeInTheDocument();
  });

  it('disabled状態を適用する', () => {
    render(<Textarea disabled data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-textarea-class';
    render(<Textarea className={customClass} data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass(customClass);
  });

  it('ユーザー入力を処理する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Textarea onChange={handleChange} data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    await user.type(textarea, 'Hello World');

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('Hello World');
  });

  it('複数行のテキストを処理する', async () => {
    const user = userEvent.setup();

    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    await user.type(textarea, '1行目{enter}2行目{enter}3行目');

    expect(textarea).toHaveValue('1行目\n2行目\n3行目');
  });

  it('onFocusイベントを処理する', async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();

    render(<Textarea onFocus={handleFocus} data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    await user.click(textarea);

    expect(handleFocus).toHaveBeenCalled();
  });

  it('onBlurイベントを処理する', async () => {
    const user = userEvent.setup();
    const handleBlur = jest.fn();

    render(<Textarea onBlur={handleBlur} data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    await user.click(textarea);
    await user.tab(); // フォーカスを外す

    expect(handleBlur).toHaveBeenCalled();
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<Textarea ref={ref} data-testid="textarea" />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(<Textarea data-testid="custom-textarea" maxLength={100} rows={5} />);

    const textarea = screen.getByTestId('custom-textarea');
    expect(textarea).toHaveAttribute('maxLength', '100');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('最小高さのスタイルを持つ', () => {
    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('min-h-[80px]');
  });

  it('フォーカス時のスタイルクラスを含む', () => {
    render(<Textarea data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    );
  });
});
