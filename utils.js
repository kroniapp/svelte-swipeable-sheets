export const touch = e => e.changedTouches ? e.changedTouches[0] : e;

export const deltaX = (e, startX) => startX - touch(e).clientX;

export const deltaY = (e, startY) => startY - touch(e).clientY;