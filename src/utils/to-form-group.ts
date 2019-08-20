export function toFormGroup(formControls) {
  return formControls.reduce((formGroup, formControl) => {
    formGroup[formControl.modelKey] = formControl;
    return formGroup;
  }, {});
}
