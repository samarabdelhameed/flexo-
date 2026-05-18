/**
 * AnimationManager - Handles Lottie animations
 * Similar to AnimationManager.swift in Pep project
 */

export class AnimationManager {
  private currentAnimation: string | null = null;
  private isPlaying: boolean = false;

  constructor() {
    console.log('AnimationManager initialized');
  }

  loadAnimation(animationName: string): void {
    try {
      console.log('AnimationManager: Loading animation:', animationName);
      this.currentAnimation = animationName;
    } catch (error) {
      console.error('AnimationManager: Error loading animation:', error);
    }
  }

  play(): void {
    if (this.currentAnimation) {
      console.log('AnimationManager: Playing animation:', this.currentAnimation);
      this.isPlaying = true;
    } else {
      console.warn('AnimationManager: No animation loaded');
    }
  }

  pause(): void {
    console.log('AnimationManager: Pausing animation');
    this.isPlaying = false;
  }

  stop(): void {
    console.log('AnimationManager: Stopping animation');
    this.isPlaying = false;
    this.currentAnimation = null;
  }

  isAnimationPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentAnimation(): string | null {
    return this.currentAnimation;
  }
}
