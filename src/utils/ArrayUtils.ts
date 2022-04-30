/**
 * 0から始まる固定長の整数配列を返す。
 * @param length 配列の長さ
 * @returns 長さがlengthの整数配列
 * @example
 * range(5) // [0,1,2,3,4]
 */
export function range(length: number) {
  return [...new Array(length).keys()];
}
