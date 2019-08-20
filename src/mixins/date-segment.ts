import { SegmentPicker } from 'cube-ui';
import { Component, Vue } from 'vue-property-decorator';

@Component<DateSegmentMixin>({
  created() {
    const nowDate = new Date();
    this.dateSegmentData = [
      {
        is: 'cube-date-picker',
        title: '开始日期',
        min: new Date(2019, 3, 1),
        max: new Date(
          nowDate.getFullYear(),
          nowDate.getMonth(),
          nowDate.getDate(),
        ),
      },
      {
        is: 'cube-date-picker',
        title: '结束日期',
        min: new Date(2019, 3, 1),
        max: new Date(
          nowDate.getFullYear(),
          nowDate.getMonth(),
          nowDate.getDate(),
        ),
      },
    ];
  },
  mounted() {
    this.dateSegmentPicker = this.$createSegmentPicker({
      data: this.dateSegmentData,
      onSelect: (selectedDates: any, selectedVals: any, selectedTexts: any) => {
        this.searchForm.createDate =
          selectedTexts[0].join('-') + '  至  ' + selectedTexts[1].join('-');
        this.startDate = selectedTexts[0].join('-');
        this.endDate = selectedTexts[1].join('-');
        this.$emit('select');
      },
      onNext: (
        i: any,
        selectedDate: any,
        selectedValue: any,
        selectedText: any,
      ) => {
        this.dateSegmentData[1].min = selectedDate;
        if (i === 0) {
          this.dateSegmentPicker.$updateProps({
            data: this.dateSegmentData,
          });
        }
      },
    });
  },
})
export default class DateSegmentMixin extends Vue {
  dateSegmentData = undefined;
  startDate = '';
  endDate = '';

  dateSegmentPicker: SegmentPicker;

  showDatePicker() {
    this.dateSegmentPicker.show();
  }
}
