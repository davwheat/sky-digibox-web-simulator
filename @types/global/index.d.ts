declare global {
  export type SkyControlPressedEvent = CustomEvent<{ control: SkyControl }>

  export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never

  export type SkyColorButton = 'red' | 'green' | 'yellow' | 'blue'

  export interface ControlVisibility {
    backUp: boolean
    select: boolean

    red: boolean
    green: boolean
    yellow: boolean
    blue: boolean

    upArrow: boolean
    downArrow: boolean
    leftArrow: boolean
    rightArrow: boolean
  }

  export type SkyControl = keyof ControlVisibility

  interface Window {
    __bgAudio: HTMLAudioElement
  }
}

export const _ = ''
