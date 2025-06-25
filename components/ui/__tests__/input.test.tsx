import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Input } from '../input';

describe('Input', () => {
  it('デフォルトのインプットが正しく表示される', () => {
    render(<Input placeholder="テキストを入力" />);

    const input = screen.getByPlaceholderText('テキストを入力');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-input');
  });

  it('type属性が正しく適用される', () => {
    render(<Input type="email" placeholder="メールアドレス" />);

    const input = screen.getByPlaceholderText('メールアドレス');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('disabled状態が正しく動作する', () => {
    render(<Input disabled placeholder="無効なインプット" />);

    const input = screen.getByPlaceholderText('無効なインプット');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed');
  });

  it('value属性と onChange が正しく動作する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input value="" onChange={handleChange} placeholder="入力テスト" />);

    const input = screen.getByPlaceholderText('入力テスト');
    await user.type(input, 'テスト入力');

    expect(handleChange).toHaveBeenCalled();
  });

  it('カスタムクラス名が適用される', () => {
    render(<Input className="custom-input-class" placeholder="カスタムインプット" />);

    const input = screen.getByPlaceholderText('カスタムインプット');
    expect(input).toHaveClass('custom-input-class');
  });

  it('ref が正しく渡される', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="ref テスト" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
