import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('基本的なカードが正しくレンダリングされる', () => {
      render(<Card data-testid="card">カード内容</Card>);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        'rounded-lg',
        'border',
        'bg-card',
        'text-card-foreground',
        'shadow-sm'
      );
      expect(card).toHaveTextContent('カード内容');
    });

    it('カスタムクラス名が正しく適用される', () => {
      render(
        <Card className="custom-card" data-testid="card">
          テスト
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-card');
    });
  });

  describe('CardHeader', () => {
    it('ヘッダーが正しくレンダリングされる', () => {
      render(<CardHeader data-testid="header">ヘッダー</CardHeader>);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });
  });

  describe('CardTitle', () => {
    it('タイトルが正しくレンダリングされる', () => {
      render(<CardTitle>カードタイトル</CardTitle>);

      const title = screen.getByRole('heading', { name: 'カードタイトル' });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
      expect(title.tagName).toBe('H3');
    });
  });

  describe('CardDescription', () => {
    it('説明文が正しくレンダリングされる', () => {
      render(<CardDescription>カードの説明文</CardDescription>);

      const description = screen.getByText('カードの説明文');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
      expect(description.tagName).toBe('P');
    });
  });

  describe('CardContent', () => {
    it('コンテンツが正しくレンダリングされる', () => {
      render(<CardContent data-testid="content">コンテンツ</CardContent>);

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('CardFooter', () => {
    it('フッターが正しくレンダリングされる', () => {
      render(<CardFooter data-testid="footer">フッター</CardFooter>);

      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });
  });

  describe('Complete Card', () => {
    it('完全なカード構造が正しくレンダリングされる', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>テストタイトル</CardTitle>
            <CardDescription>テスト説明</CardDescription>
          </CardHeader>
          <CardContent>
            <p>メインコンテンツ</p>
          </CardContent>
          <CardFooter>
            <button>アクション</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'テストタイトル' })).toBeInTheDocument();
      expect(screen.getByText('テスト説明')).toBeInTheDocument();
      expect(screen.getByText('メインコンテンツ')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'アクション' })).toBeInTheDocument();
    });
  });
});
