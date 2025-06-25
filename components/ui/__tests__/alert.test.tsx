import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert', () => {
  it('デフォルトのアラートをレンダリングする', () => {
    render(<Alert data-testid="alert">テストアラート</Alert>);

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('role', 'alert');
    expect(alert).toHaveClass('relative', 'w-full', 'rounded-lg', 'border', 'p-4');
  });

  it('defaultバリアントを適用する', () => {
    render(
      <Alert variant="default" data-testid="alert">
        デフォルトアラート
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('bg-background', 'text-foreground');
  });

  it('destructiveバリアントを適用する', () => {
    render(
      <Alert variant="destructive" data-testid="alert">
        エラーアラート
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-alert-class';
    render(
      <Alert className={customClass} data-testid="alert">
        テストアラート
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass(customClass);
  });

  it('子要素を正しくレンダリングする', () => {
    render(
      <Alert data-testid="alert">
        <span>アラート内容</span>
      </Alert>
    );

    expect(screen.getByText('アラート内容')).toBeInTheDocument();
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(
      <Alert ref={ref} data-testid="alert">
        テストアラート
      </Alert>
    );

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(
      <Alert data-testid="custom-alert" aria-label="カスタムアラート">
        テストアラート
      </Alert>
    );

    const alert = screen.getByTestId('custom-alert');
    expect(alert).toHaveAttribute('aria-label', 'カスタムアラート');
  });
});

describe('AlertTitle', () => {
  it('デフォルトのアラートタイトルをレンダリングする', () => {
    render(<AlertTitle>アラートタイトル</AlertTitle>);

    const title = screen.getByText('アラートタイトル');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H5');
    expect(title).toHaveClass('mb-1', 'font-medium', 'leading-none', 'tracking-tight');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-title-class';
    render(<AlertTitle className={customClass}>タイトル</AlertTitle>);

    const title = screen.getByText('タイトル');
    expect(title).toHaveClass(customClass);
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<AlertTitle ref={ref}>タイトル</AlertTitle>);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLHeadingElement));
  });

  it('その他のHTML属性を適用する', () => {
    render(
      <AlertTitle data-testid="custom-title" id="alert-title">
        タイトル
      </AlertTitle>
    );

    const title = screen.getByTestId('custom-title');
    expect(title).toHaveAttribute('id', 'alert-title');
  });
});

describe('AlertDescription', () => {
  it('デフォルトのアラート説明をレンダリングする', () => {
    render(<AlertDescription>アラートの説明文です</AlertDescription>);

    const description = screen.getByText('アラートの説明文です');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('DIV');
    expect(description).toHaveClass('text-sm');
  });

  it('カスタムクラス名を適用する', () => {
    const customClass = 'custom-description-class';
    render(<AlertDescription className={customClass}>説明</AlertDescription>);

    const description = screen.getByText('説明');
    expect(description).toHaveClass(customClass);
  });

  it('refを正しく転送する', () => {
    const ref = jest.fn();

    render(<AlertDescription ref={ref}>説明</AlertDescription>);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('HTML要素を含む説明をレンダリングする', () => {
    render(
      <AlertDescription>
        <p>段落1</p>
        <p>段落2</p>
      </AlertDescription>
    );

    expect(screen.getByText('段落1')).toBeInTheDocument();
    expect(screen.getByText('段落2')).toBeInTheDocument();
  });

  it('その他のHTML属性を適用する', () => {
    render(
      <AlertDescription data-testid="custom-description" aria-label="詳細説明">
        説明
      </AlertDescription>
    );

    const description = screen.getByTestId('custom-description');
    expect(description).toHaveAttribute('aria-label', '詳細説明');
  });
});

describe('Alert組み合わせテスト', () => {
  it('完全なアラートコンポーネントの組み合わせ', () => {
    render(
      <Alert variant="destructive" data-testid="complete-alert">
        <AlertTitle>エラーが発生しました</AlertTitle>
        <AlertDescription>
          システムエラーが発生しました。管理者にお問い合わせください。
        </AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('complete-alert');
    const title = screen.getByText('エラーが発生しました');
    const description = screen.getByText(
      'システムエラーが発生しました。管理者にお問い合わせください。'
    );

    expect(alert).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
  });

  it('アイコン付きアラートの構造', () => {
    render(
      <Alert data-testid="icon-alert">
        <svg data-testid="alert-icon" />
        <AlertTitle>情報</AlertTitle>
        <AlertDescription>重要な情報があります。</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('icon-alert');
    const icon = screen.getByTestId('alert-icon');
    const title = screen.getByText('情報');
    const description = screen.getByText('重要な情報があります。');

    expect(alert).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});
