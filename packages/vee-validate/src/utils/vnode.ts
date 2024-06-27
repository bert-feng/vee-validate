import { SetupContext } from 'vue';

type HTMLElementWithValueBinding = HTMLElement & { _value: unknown };

export function normalizeChildren(
  tag: string | undefined | null,
  context: SetupContext<any>,
  slotProps: () => Record<string, unknown>,
) {
  // 检查是否有任何插槽定义
  if (Object.keys(context.slots).length === 0) {
    return undefined;
  }

  // 创建一个结果对象来存储所有处理过的插槽
  const normalizedSlots: any = {};

  // 遍历所有插槽并应用 slotProps
  for (const slotName in context.slots) {
    const slot = context.slots[slotName];
    if (slot) {
      normalizedSlots[slotName] = () => slot(slotProps());
    }
  }

  // 如果 tag 是字符串或未定义，并且存在 default 插槽，则直接返回 default 插槽的内容
  if ((typeof tag === 'string' || !tag) && context.slots.default) {
    return context.slots.default(slotProps());
  }

  // 返回处理过的所有插槽
  return normalizedSlots;
}

// export function normalizeChildren(
//   tag: string | undefined | null,
//   context: SetupContext<any>,
//   slotProps: () => Record<string, unknown>,
// ) {
//   if (!context.slots.default) {
//     return context.slots.default;
//   }

//   if (typeof tag === 'string' || !tag) {
//     return context.slots.default(slotProps());
//   }

//   return {
//     default: () => context.slots.default?.(slotProps()),
//   };
// }

/**
 * Vue adds a `_value` prop at the moment on the input elements to store the REAL value on them, real values are different than the `value` attribute
 * as they do not get casted to strings unlike `el.value` which preserves user-code behavior
 */
export function getBoundValue(el: HTMLElement): unknown {
  if (hasValueBinding(el)) {
    return el._value;
  }

  return undefined;
}

/**
 * Vue adds a `_value` prop at the moment on the input elements to store the REAL value on them, real values are different than the `value` attribute
 * as they do not get casted to strings unlike `el.value` which preserves user-code behavior
 */
export function hasValueBinding(el: HTMLElement): el is HTMLElementWithValueBinding {
  return '_value' in el;
}
