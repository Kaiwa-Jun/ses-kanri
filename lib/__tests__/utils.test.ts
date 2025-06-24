import { cn } from '@/lib/utils';

describe('cn function', () => {
  it('複数のクラス名を正しく結合する', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('条件付きクラス名を正しく処理する', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('オブジェクト形式のクラス名を正しく処理する', () => {
    const result = cn({
      active: true,
      disabled: false,
      primary: true,
    });
    expect(result).toBe('active primary');
  });

  it('Tailwind CSSクラスの重複を正しく処理する', () => {
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toBe('py-2 px-6');
  });

  it('空の値やundefinedを正しく処理する', () => {
    const result = cn('class1', '', undefined, null, 'class2');
    expect(result).toBe('class1 class2');
  });

  it('配列形式のクラス名を正しく処理する', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('複雑なTailwindクラスの重複を正しく処理する', () => {
    const result = cn('bg-red-500 text-white p-4', 'bg-blue-500 p-2', 'hover:bg-green-500');
    expect(result).toBe('text-white bg-blue-500 p-2 hover:bg-green-500');
  });

  it('引数がない場合は空文字を返す', () => {
    const result = cn();
    expect(result).toBe('');
  });
});
