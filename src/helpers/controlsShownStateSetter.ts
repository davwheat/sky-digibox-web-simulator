/**
 * Returns a set state function to be passed into `useSetRecoilState`.
 *
 * If `isShown` is not provided, the control will be toggled.
 *
 * @example <caption>Shows the back up button</caption>
 * useSetRecoilState(controlsState)(controlsShownStateSetter('backUp', true))
 *
 * @param controlName Name of array of names for the control(s) to show/hide/toggle
 * @param isShown (optional) Whether it/they should be shown or not
 * @returns Recoil setState handler function to set the visibility of this control
 */
export default function controlsShownStateSetter(controlName: SkyControl | SkyControl[], isShown?: boolean) {
  if (Array.isArray(controlName)) {
    return controlsRaw => {
      let controls = { ...controlsRaw }
      console.log('start', controls)

      controlName.forEach(control => {
        if (Object.keys(controls).includes(control)) {
          controls[control] = typeof isShown !== 'boolean' ? !controls[control] : isShown
        } else {
          throw `Invalid control provided to \`controlsShownStateSetter\`: "${control}".`
        }
      })

      console.log(controls)
      return controls
    }
  }

  return controlsRaw => {
    let controls = { ...controlsRaw }
    console.log('start', controls)

    if (Object.keys(controls).includes(controlName)) {
      controls[controlName] = typeof isShown !== 'boolean' ? !controls[controlName] : isShown
    } else {
      throw `Invalid control provided to \`controlsShownStateSetter\`: "${controlName}".`
    }

    console.log(controls)
    return controls
  }
}
