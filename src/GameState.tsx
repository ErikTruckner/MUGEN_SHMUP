import { atom } from 'jotai';

export const masterSpeedAtom = atom(0.5); // Initial master speed value

export const isMobileAtom = atom(false); // Initial mobile check

export const joystickInputAtom = atom({ x: 0, y: 0 }); // Joystick input (x, y) normalized from -1 to 1

export const fireRateAtom = atom(500); // Initial fire rate in milliseconds

interface Bullet {
    id: number;
    position: [number, number, number];
    velocity: [number, number, number];
}

interface Bomb {
    id: number;
    position: [number, number, number];
    target: [number, number, number];
}

export const bulletsAtom = atom<Bullet[]>([]);

export const bombsAtom = atom<Bomb[]>([]);

export const shootAtom = atom(false);

export const bombAtom = atom(false);
