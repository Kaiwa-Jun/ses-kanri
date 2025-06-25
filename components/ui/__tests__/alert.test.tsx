import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Alert, AlertDescription, AlertTitle } from '../alert';

describe('Alert', () => {
  it('デフォルトのアラートが正しく表示される', () => {
    render(<Alert>アラートコンテンツ</Alert>);

    const alert = screen.getByText('アラートコンテンツ');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('relative', 'w-full', 'rounded-lg', 'border');
  });

  it('destructiveバリアントが正しく適用される', () => {
    render(<Alert variant="destructive">エラーアラート</Alert>);

    const alert = screen.getByText('エラーアラート');
    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
  });

  it('AlertTitleが正しく表示される', () => {
    render(<AlertTitle>アラートタイトル</AlertTitle>);

    const title = screen.getByText('アラートタイトル');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('mb-1', 'font-medium', 'leading-none');
  });

  it('AlertDescriptionが正しく表示される', () => {
    render(<AlertDescription>アラートの説明</AlertDescription>);

    const description = screen.getByText('アラートの説明');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm');
  });

  it('完全なAlertが正しく表示される', () => {
    render(
      <Alert>
        <AlertTitle>警告</AlertTitle>
        <AlertDescription>これは重要な情報です。</AlertDescription>
      </Alert>
    );

    expect(screen.getByText('警告')).toBeInTheDocument();
    expect(screen.getByText('これは重要な情報です。')).toBeInTheDocument();
  });

  it('destructiveバリアントの完全なAlertが正しく表示される', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>問題が発生しました。</AlertDescription>
      </Alert>
    );

    const alert =
      screen.getByText('エラー').closest('[role]') || screen.getByText('エラー').parentElement;
    expect(alert).toHaveClass('border-destructive/50');
    expect(screen.getByText('エラー')).toBeInTheDocument();
    expect(screen.getByText('問題が発生しました。')).toBeInTheDocument();
  });

  it('カスタムクラス名が適用される', () => {
    render(<Alert className="custom-alert-class">カスタムアラート</Alert>);

    const alert = screen.getByText('カスタムアラート');
    expect(alert).toHaveClass('custom-alert-class');
  });

  it('role属性が正しく適用される', () => {
    render(<Alert role="alert">重要なアラート</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('重要なアラート');
  });

  it('ref が正しく渡される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>ref テスト</Alert>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
