const eventMap = new WeakMap();

export function setupEventListeners(root) {
  if (root.__eventDelegationSetup) {
    return;
  }
  root.__eventDelegationSetup = true;

  root.addEventListener("click", (e) => {
    let node = e.target;
    while (node && node !== root) {
      const handlers = eventMap.get(node);
      if (handlers && handlers["click"]) {
        handlers["click"].forEach((fn) => fn.call(node, e));
      }
      node = node.parentNode;
    }
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) eventMap.set(element, {});
  const handlers = eventMap.get(element);
  if (!handlers[eventType]) handlers[eventType] = new Set();
  handlers[eventType].add(handler);
}

export function removeEvent(element, eventType, handler) {
  const handlers = eventMap.get(element);
  if (handlers && handlers[eventType]) {
    handlers[eventType].delete(handler);
  }
}
