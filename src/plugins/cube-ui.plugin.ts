import 'cube-ui/lib/style/style.min.css';
import { PluginObject, VueConstructor } from 'vue';

// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
  /* eslint-disable no-unused-vars */
  // basic
  Button,
  TabBar,
  // tslint:disable-next-line: ordered-imports
  TabPanels,
  // form
  Checkbox,
  CheckboxGroup,
  Input,
  Textarea,
  Select,
  Validator,
  Upload,
  Form,
  // popup
  ActionSheet,
  Popup,
  Toast,
  Picker,
  CascadePicker,
  DatePicker,
  SegmentPicker,
  Dialog,
  // scroll
  Scroll,
  Slide,
  Swipe,
  IndexList,
  Sticky,
  ScrollNav,
  ScrollNavBar,
} from 'cube-ui';

export class CubeUIPlugin implements PluginObject<any> {
  install(Vue: VueConstructor) {
    Vue.use(Button);
    Vue.use(TabBar);
    Vue.use(TabPanels);
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
    Vue.use(Input);
    Vue.use(Textarea);
    Vue.use(Select);
    Vue.use(Validator);
    Vue.use(Upload);
    Vue.use(Form);
    Vue.use(ActionSheet);
    Vue.use(Popup);
    Vue.use(Toast);
    Vue.use(Picker);
    Vue.use(CascadePicker);
    Vue.use(DatePicker);
    Vue.use(SegmentPicker);
    Vue.use(Dialog);
    Vue.use(Scroll);
    Vue.use(Slide);
    Vue.use(Swipe);
    Vue.use(IndexList);
    Vue.use(Sticky);
    Vue.use(ScrollNav);
    Vue.use(ScrollNavBar);
  }
}
