import { atom } from 'jotai';

export const masterSpeedAtom = atom(0.5); // Initial master speed value

export const isMobileAtom = atom(false); // Initial mobile check

export const joystickInputAtom = atom({ x: 0, y: 0 }); // Joystick input (x, y) normalized from -1 to 1
