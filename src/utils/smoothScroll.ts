/**
 * Smoothly scrolls the page to the target element.
 *
 * @param targetId - The ID of the element to scroll to (without the '#').
 * @param offset - Optional vertical offset in pixels (e.g., for sticky header).
 */
export const smoothScrollTo = (targetId: string, offset: number = 0): void => {
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Optionally, update URL hash without jump (requires careful history management)
    // history.pushState(null, '', `#${targetId}`);
  } else {
    // console.warn(`Smooth scroll target not found: #${targetId}`); // Removed
  }
};
