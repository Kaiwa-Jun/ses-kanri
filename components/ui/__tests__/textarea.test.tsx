import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Textarea } from '../textarea';

describe('Textarea', () => {
  it('デフォルトのテキストエリアが正しく表示される', () => {
    render(<Textarea placeholder="メッセージを入力" />);

    const textarea = screen.getByPlaceholderText('メッセージを入力');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('border-input');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('disabled状態が正しく動作する', () => {
    render(<Textarea disabled placeholder="無効なテキストエリア" />);

    const textarea = screen.getByPlaceholderText('無効なテキストエリア');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:cursor-not-allowed');
  });

  it('value属性と onChange が正しく動作する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Textarea value="" onChange={handleChange} placeholder="入力テスト" />);

    const textarea = screen.getByPlaceholderText('入力テスト');
    await user.type(textarea, 'テスト入力\n複数行テスト');

    expect(handleChange).toHaveBeenCalled();
  });

  it('rows属性が正しく適用される', () => {
    render(<Textarea rows={5} placeholder="5行のテキストエリア" />);

    const textarea = screen.getByPlaceholderText('5行のテキストエリア');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('cols属性が正しく適用される', () => {
    render(<Textarea cols={50} placeholder="50列のテキストエリア" />);

    const textarea = screen.getByPlaceholderText('50列のテキストエリア');
    expect(textarea).toHaveAttribute('cols', '50');
  });

  it('カスタムクラス名が適用される', () => {
    render(<Textarea className="custom-textarea-class" placeholder="カスタムテキストエリア" />);

    const textarea = screen.getByPlaceholderText('カスタムテキストエリア');
    expect(textarea).toHaveClass('custom-textarea-class');
  });

  it('ref が正しく渡される', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="ref テスト" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('maxLength属性が正しく適用される', () => {
    render(<Textarea maxLength={100} placeholder="最大100文字" />);

    const textarea = screen.getByPlaceholderText('最大100文字');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  it('resize機能が正しく動作する', () => {
    render(<Textarea className="resize-none" placeholder="リサイズ無効" />);

    const textarea = screen.getByPlaceholderText('リサイズ無効');
    expect(textarea).toHaveClass('resize-none');
  });
});
