import React from "react";

import { range } from "utils/ArrayUtils";

/**
 * @param elementsLength 要素の数
 * @param setSelectedIndex 要素の選択状態を更新する関数
 * @returns  onClickMenu: メニューのクリックハンドラ, scrollAreaRef: スクロールするエリアのref, elementsRefs: メニューによってスクロール位置を操作したい要素のref
 */
export function useAnchorScroll(elementsLength: number, setSelectedIndex: (index: number) => void) {
  const elementsRefs = React.useMemo(
    () => range(elementsLength).map((_) => React.createRef<HTMLDivElement>()),
    [elementsLength]
  );
  const onClickMenu = React.useCallback(
    (index: number) => {
      const element = elementsRefs[index].current;
      if (element != null) {
        element.scrollIntoView({
          behavior: "auto", // "smooth"はIntersectionObserverのコールバックがたくさん走ってしまい挙動がカクカクになってしまう。"auto"(デフォルト値)はまだマシ。
          block: "start",
        });
      }
      setSelectedIndex(index);
    },
    [elementsRefs, setSelectedIndex]
  );
  const intersectCallback = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        elementsRefs.forEach((ref, index) => {
          if (ref.current != null && ref.current.isEqualNode(entry.target) && entry.isIntersecting) {
            setSelectedIndex(index);
          }
        });
      });
    },
    [elementsRefs, setSelectedIndex]
  );
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver(intersectCallback, {
      root: scrollAreaRef.current,
      rootMargin: "-50% 0px",
      threshold: 0,
    });
    elementsRefs.forEach((ref) => {
      if (ref.current != null) {
        observer.observe(ref.current);
      }
    });
    return () => {
      elementsRefs.forEach((ref) => {
        if (ref.current != null) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [intersectCallback, elementsRefs]);
  return { onClickMenu, scrollAreaRef, elementsRefs };
}
