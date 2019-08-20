export const applyFormConfig = [
  {
    type: 'input',
    modelKey: 'settlementCount',
    label: '个数',
    props: {
      type: 'number',
      readonly: true,
    },
  },
  {
    type: 'input',
    modelKey: 'settlementMonty',
    label: '待结算奖励',
    props: {
      type: 'number',
      readonly: true,
    },
  },
  {
    type: 'input',
    modelKey: 'transactionPwd',
    label: '交易密码',
    props: {
      type: 'password',
      placeholder: '请输入交易密码',
      autocomplete: false,
    },
    rules: {
      required: true,
      min: 6,
      max: 20,
    },
    trigger: 'blur',
  },
];
