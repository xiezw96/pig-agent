<template>
  <cube-page title="开柜补货">
    <template #content>
      <cube-form class="border-radius" :schema="formGroup"></cube-form>
      <template v-if="equipment">
        <h1 style="text-align: left; font-size: 20px; margin: 16px 0;">
          柜门
        </h1>
        <cube-button
          v-if="gates.length > 0"
          class="border-radius"
          @click="onOpenAll()"
        >
          全部打开
        </cube-button>
        <cube-button
          v-for="gate in gates"
          :key="gate.id"
          class="border-radius"
          style="margin: 8px 0;"
          @click="onOpen(gate.id)"
        >
          {{ gate.code }}({{ gate.status | boxstatus }})
        </cube-button>
      </template>
    </template>
  </cube-page>
</template>

<script lang="ts">
import { Dialog } from 'cube-ui';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CubePage from '@/components/cube-page.vue';
import { openAllGate, openGate } from '@/services';

const Equipment = namespace('equipment');

@Component<EquipmentGateComponent>({
  components: {
    CubePage,
  },
})
export default class EquipmentGateComponent extends Vue {
  @Equipment.State
  equipments: any[];

  selectedId = null;

  get equipment() {
    if (this.selectedId === null) return;

    return this.equipments.find(eqp => eqp.id === this.selectedId);
  }

  get gates() {
    if (!this.equipment) return [];

    const gates = this.equipment.aisleDetails;

    return gates;
  }

  get formGroup() {
    return {
      groups: [
        {
          fields: [
            {
              label: '柜子选择',
              type: 'select',
              props: {
                title: '柜子',
                placeholder: '请选择要操作的柜子',
                options: this.equipments.map(eqp => ({
                  text: eqp.name,
                  value: eqp.id,
                })),
              },
              events: {
                input: this.onSelect,
              },
            },
          ],
        },
      ],
    };
  }

  @Equipment.Action
  getEquipments: () => Promise<void>;

  async onSelect(id) {
    this.selectedId = id;
  }

  async onOpenAll(id) {
    this.open(openAllGate, this.selectedId);
  }

  async onOpen(id) {
    this.open(openGate, id);
  }

  async open(open, id) {
    const confirm = await this.confirm();

    if (!confirm) return;

    const loading = this.loading();
    try {
      const opened = await open(id);
      this.getEquipments();
      setTimeout(() => {
        this.toast('柜门已打开');
      }, 20);
    } finally {
      loading.hide();
    }
  }

  loading() {
    return this.$createToast({
      time: 0,
      mask: true,
      txt: '开门中...',
    }).show();
  }

  confirm() {
    return new Promise(resolve => {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '请确保当前就在所选柜子旁，以免照成商品丢失',
        confirmBtn: {
          text: '确认打开',
        },
        onConfirm: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      }).show();
    });
  }

  toast(txt, type = 'txt') {
    this.$createToast({
      type,
      txt,
      time: 2000,
    }).show();
  }
}
</script>
<style lang="stylus" scoped>
@require '~@/theme.styl'

.border-radius
  border-radius $border-radius
</style>

