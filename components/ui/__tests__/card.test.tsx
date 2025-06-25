import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card';

describe('Card', () => {
  it('Cardコンポーネントが正しく表示される', () => {
    render(<Card>カードコンテンツ</Card>);

    const card = screen.getByText('カードコンテンツ');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
  });

  it('CardHeaderが正しく表示される', () => {
    render(<CardHeader>ヘッダーコンテンツ</CardHeader>);

    const header = screen.getByText('ヘッダーコンテンツ');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
  });

  it('CardTitleが正しく表示される', () => {
    render(<CardTitle>カードタイトル</CardTitle>);

    const title = screen.getByText('カードタイトル');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-semibold');
  });

  it('CardDescriptionが正しく表示される', () => {
    render(<CardDescription>カードの説明</CardDescription>);

    const description = screen.getByText('カードの説明');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('CardContentが正しく表示される', () => {
    render(<CardContent>メインコンテンツ</CardContent>);

    const content = screen.getByText('メインコンテンツ');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6', 'pt-0');
  });

  it('CardFooterが正しく表示される', () => {
    render(<CardFooter>フッターコンテンツ</CardFooter>);

    const footer = screen.getByText('フッターコンテンツ');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
  });

  it('完全なCardが正しく表示される', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>テストタイトル</CardTitle>
          <CardDescription>テスト説明</CardDescription>
        </CardHeader>
        <CardContent>テストコンテンツ</CardContent>
        <CardFooter>テストフッター</CardFooter>
      </Card>
    );

    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
    expect(screen.getByText('テスト説明')).toBeInTheDocument();
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
    expect(screen.getByText('テストフッター')).toBeInTheDocument();
  });

  it('カスタムクラス名が各コンポーネントに適用される', () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">ヘッダー</CardHeader>
        <CardContent className="custom-content">コンテンツ</CardContent>
      </Card>
    );

    const card = screen.getByText('ヘッダー').closest('.custom-card');
    const header = screen.getByText('ヘッダー');
    const content = screen.getByText('コンテンツ');

    expect(card).toHaveClass('custom-card');
    expect(header).toHaveClass('custom-header');
    expect(content).toHaveClass('custom-content');
  });
});
