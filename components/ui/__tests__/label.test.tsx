import { render, screen } from '@testing-library/react';
import { Label } from '../label';

describe('Label', () => {
  it('デフォルトのラベルをレンダリングする', () => {
    render(<Label>テストラベル</Label>);

    const label = screen.getByText('テストラベル');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
  });

  it('htmlFor属性を適用する', () => {
    render(<Label htmlFor="test-input">テストラベル</Label>);

    const label = screen.getByText('テストラベル');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-label-class';
    render(<Label className={customClass}>テストラベル</Label>);

    const label = screen.getByText('テストラベル');
    expect(label).toHaveClass(customClass);
  });

  it('子要素を正しくレンダリングする', () => {
    render(
      <Label>
        <span>アイコン</span>
        ラベルテキスト
      </Label>
    );

    const label = screen.getByText('ラベルテキスト');
    expect(label).toBeInTheDocument();
    expect(screen.getByText('アイコン')).toBeInTheDocument();
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<Label ref={ref}>テストラベル</Label>);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLLabelElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(
      <Label data-testid="custom-label" title="ツールチップ">
        テストラベル
      </Label>
    );

    const label = screen.getByTestId('custom-label');
    expect(label).toHaveAttribute('title', 'ツールチップ');
  });

  it('labelタグとしてレンダリングされる', () => {
    render(<Label data-testid="label">テストラベル</Label>);

    const label = screen.getByTestId('label');
    expect(label.tagName).toBe('LABEL');
  });

  it('複数のラベルを同時にレンダリングできる', () => {
    render(
      <div>
        <Label>ラベル1</Label>
        <Label>ラベル2</Label>
        <Label>ラベル3</Label>
      </div>
    );

    expect(screen.getByText('ラベル1')).toBeInTheDocument();
    expect(screen.getByText('ラベル2')).toBeInTheDocument();
    expect(screen.getByText('ラベル3')).toBeInTheDocument();
  });

  it('フォーム要素と関連付けできる', () => {
    render(
      <div>
        <Label htmlFor="username">ユーザー名</Label>
        <input id="username" type="text" />
      </div>
    );

    const label = screen.getByText('ユーザー名');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'username');
    expect(input).toHaveAttribute('id', 'username');
  });

  it('必須マーカーを含むラベルをレンダリングできる', () => {
    render(
      <Label>
        メールアドレス
        <span className="text-red-500">*</span>
      </Label>
    );

    expect(screen.getByText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('onClick イベントを処理する', () => {
    const handleClick = jest.fn();

    render(<Label onClick={handleClick}>クリック可能ラベル</Label>);

    const label = screen.getByText('クリック可能ラベル');
    label.click();

    expect(handleClick).toHaveBeenCalled();
  });

  it('peer-disabled状態のスタイルクラスを含む', () => {
    render(<Label>テストラベル</Label>);

    const label = screen.getByText('テストラベル');
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
  });
});
