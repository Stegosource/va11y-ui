import FOCUSABLE from './data/focusable.js';

/**
 * Generates a random string of defined length based on
 * a string of allowed characters.
 *
 * @param  {number} length  How many random characters will be in the returned string. Defaults to 10
 * @param  {string} allowed Which characters can be used when creating the random string. Defaults to A-Z,a-z,0-9
 * @return {string}         A string of random characters
 */
export function randomString(
  length = 10,
  allowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += allowed.charAt(Math.floor(Math.random() * allowed.length));
  }
  return result;
}

/**
 * [safeSlot description]
 *
 * @param  {[type]} h    [description]
 * @param  {[type]} slot [description]
 * @return {[type]}      [description]
 */
export function safeSlot(h, slot) {
  return slot && slot.length > 1 ? h('div', slot) : slot;
}

/**
 * [applyFocusTrap description]
 *
 * @param  {HTMLElement} el    [description]
 * @param  {Event}       event [description]
 * @return {undefined}         [description]
 */
export function applyFocusTrap(el, event) {
  const focusable = Array.from(el.querySelectorAll(FOCUSABLE));

  if (!focusable.length) {
    event.preventDefault();
    return;
  }

  if (!el.contains(document.activeElement)) {
    event.preventDefault();
    focusable[0].focus();
  } else {
    const focusedItemIndex = focusable.indexOf(document.activeElement);

    if (event.shiftKey && focusedItemIndex === 0) {
      focusable[focusable.length - 1].focus();
      event.preventDefault();
    }

    if (!event.shiftKey && focusedItemIndex === focusable.length - 1) {
      focusable[0].focus();
      event.preventDefault();
    }
  }
}

/**
 * Detects if a VDOM element is a <RouterLink>, <a>, or <button>
 *
 * @param  {object} props           props container
 * @param  {string} props.to        the :to prop for router-link
 * @param  {object} data            data container
 * @param  {object} data.attrs      attributes container
 * @return {string}                 'RouterLink', 'a', or 'button'
 */
export function getTag({ to }, { attrs }) {
  if (to) {
    return 'RouterLink';
  }
  if (attrs && attrs.href) {
    return 'a';
  }
  return 'button';
}
