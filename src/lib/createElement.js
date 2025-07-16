//createElement함수는 가상돔을 돔으로 변환해주는 것
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  //   if (typeof vNode.type === "function") {
  //     const { props = {}, children = [] } = vNode;
  //     const nextVNode = vNode.type({ ...props, children });
  //     return createElement(nextVNode);
  //   }
  if (typeof vNode.type === "function" || (typeof vNode.type === "object" && typeof vNode.type.type === "function")) {
    throw new Error("컴포넌트는 createElement로 직접 처리할 수 없습니다. 먼저 normalizeVNode로 정규화하세요.");
  }

  const $el = document.createElement(vNode.type);

  Object.entries(vNode.props || {}).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      addEvent($el, eventName, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key === "style" && typeof value === "object") {
      Object.entries(value).forEach(([styleName, styleValue]) => {
        $el.style[styleName] = styleValue;
      });
    } else if (key.startsWith("data-")) {
      $el.setAttribute(key, value);
    } else if (typeof value === "boolean") {
      if (value) $el.setAttribute(key, "");
      // false면 아무것도 안 함
    } else {
      $el.setAttribute(key, value);
    }
  });

  const children = Array.isArray(vNode.children) ? vNode.children : [];
  children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}

//function updateAttributes($el, props) {}
