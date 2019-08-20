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
import { SegmentPicker, Input } from 'cube-ui';
import { format, parse, addYears, subYears } from 'date-fns';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component<DateRangePickerComponent>({
  created() {
    this.segmentData = [
      {
        is: 'cube-date-picker',
        title: '开始时间',
        columnCount: this.columnCount,
        min: subYears(new Date(), 100),
        max: addYears(new Date(), 100),
        value: this.value[0] || new Date(),
      },
      {
        is: 'cube-date-picker',
        title: '结束时间',
        columnCount: this.columnCount,
        min: subYears(new Date(), 100),
        max: addYears(new Date(), 100),
        value: this.value[1] || new Date(),
      },
    ];
  },
  mounted(this: DateRangePickerComponent) {
    this.dateRangePicker = this.$createSegmentPicker({
      data: this.segmentData,
      onSelect: (selectedDates, selectedVals, selectedTexts) => {
        this.$emit('input', [...selectedDates]);
      },
      onNext: (i, selectedDate, selectedValue, selectedText) => {
        this.segmentData[1].min = selectedDate;
        if (i === 0) {
          (this.dateRangePicker as any).$updateProps({
            data: this.segmentData,
          });
        }
      },
    });
  },
})
export default class DateRangePickerComponent extends Vue {
  @Prop({
    default: [new Date(), new Date()],
  })
  value: any[];

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

  @Prop({default: 'YYYY-MM-DD'})
  format: string;

  @Prop({default: 3})
  columnCount: number;

  cleared: boolean;

  $refs: {
    input: Input;
  };

  segmentData: any[];

  dateRangePicker: SegmentPicker;

  get dateString() {
    if (this.value.length !== 2) return '';
    const [startDate, endDate] = this.value;
    return [
      format(this.value[0], this.format),
      format(this.value[1], this.format),
    ].join('至');
  }

  @Watch('value')
  onValueChange(val) {
    const [start, end] = val;
    this.segmentData[0].value = start;
    this.segmentData[1].value = end;
    (this.dateRangePicker as any).$updateProps({
      data: this.segmentData,
    });
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
      this.dateRangePicker.show();
    });
  }

  onInput(dateString) {
    if (dateString === '') {
      this.$emit('input', []);
      this.cleared = true;
    }
  }
}
</script>
<style lang="stylus" scoped>
.form-item-button
  padding-left 0
  padding-right 0
  text-align left
  color inherit
  background none
  border none

  &:active
    background none
</style>

