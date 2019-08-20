<template>
  <cube-input
    ref="input"
    :value="dateString"
    :disabled="disabled || readonly"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :clearable="{ visible: clearable, blurHidden: false }"
    @input="onInput($event)"
    @focus="onFocus($event)"
  ></cube-input>
</template>

<script lang="ts">
import { DatePicker, Input } from 'cube-ui';
import { format, isDate } from 'date-fns';
import { Component, Vue, Model, Prop, Watch } from 'vue-property-decorator';

@Component<DatePickerComponent>({
  mounted(this: DatePickerComponent) {
    this.datePicker = this.$createDatePicker({
      ...this.$attrs,
      value: this.value,
      onSelect: this.onSelect,
    });
  },
})
export default class DatePickerComponent extends Vue {
  @Prop()
  value: Date;

  @Prop()
  disabled: boolean;

  @Prop()
  readonly: boolean;

  @Prop()
  placeholder: boolean;

  @Prop()
  autofocus: boolean;

  @Prop()
  clearable: boolean;

  cleared: boolean;

  datePicker: DatePicker;

  $refs: {
    input: Input;
  };

  get dateString() {
    return isDate(this.value) ? format(this.value, 'YYYY-MM-DD') : '';
  }

  onFocus() {
    this.$nextTick(() => {
      if (this.cleared) {
        (this.$refs.input as any).blur();
        setTimeout(() => {
          this.cleared = false;
        }, 300);
        return;
      }
      (this.$refs.input as any).blur();
      this.datePicker.show();
    });
  }

  onInput(dateString) {
    if (dateString === '') {
      this.$emit('input');
      this.cleared = true;
    }
  }

  onSelect(date, selectedVal, selectedText) {
    this.$emit('input', date);
  }
}
</script>
