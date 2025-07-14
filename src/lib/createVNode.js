export function createVNode(type, props, ...children) {
  return {
    type,
    props: props || {}, // props가 undefined일 경우 빈 객체로 초기화
    children: children.flat(),
  };
}
