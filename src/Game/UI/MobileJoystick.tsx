import React, { useRef, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { joystickInputAtom } from '../../GameState';

const JOYSTICK_SIZE = 100;
const KNOB_SIZE = 40;

const MobileJoystick = () => {
  const setJoystickInput = useSetAtom(joystickInputAtom);
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !joystickRef.current || !knobRef.current) return;

    const joystickRect = joystickRef.current.getBoundingClientRect();
    const touch = e.touches[0];

    const centerX = joystickRect.left + joystickRect.width / 2;
    const centerY = joystickRect.top + joystickRect.height / 2;

    let deltaX = touch.clientX - centerX;
    let deltaY = touch.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = joystickRect.width / 2 - KNOB_SIZE / 2;

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxDistance;
      deltaY = Math.sin(angle) * maxDistance;
    }

    knobRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Normalize input to -1 to 1
    const normalizedX = deltaX / maxDistance;
    const normalizedY = -deltaY / maxDistance; // Y-axis is inverted in screen coordinates

    setJoystickInput({ x: normalizedX, y: normalizedY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(0px, 0px)`;
    }
    setJoystickInput({ x: 0, y: 0 });
  };

  useEffect(() => {
    const joystickElement = joystickRef.current;
    if (joystickElement) {
      joystickElement.addEventListener('touchstart', handleTouchStart);
      joystickElement.addEventListener('touchmove', handleTouchMove);
      joystickElement.addEventListener('touchend', handleTouchEnd);
      joystickElement.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      if (joystickElement) {
        joystickElement.removeEventListener('touchstart', handleTouchStart);
        joystickElement.removeEventListener('touchmove', handleTouchMove);
        joystickElement.removeEventListener('touchend', handleTouchEnd);
        joystickElement.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [isDragging]); // Re-run effect when isDragging changes to ensure correct event listeners

  return (
    <div
      ref={joystickRef}
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
        borderRadius: '50%',
        backgroundColor: 'rgba(128, 128, 128, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        touchAction: 'none', // Prevent browser scrolling/zooming
        zIndex: 1000,
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          position: 'absolute',
        }}
      />
    </div>
  );
};

export default MobileJoystick;