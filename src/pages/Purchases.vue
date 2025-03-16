<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Formulario de Compra</div>
          <q-form @submit="savePurchase" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="purchase.supplier"
                  :options="suppliers"
                  option-label="label"
                  option-value="value"
                  label="Proveedor *"
                  outlined
                  dense
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Proveedor es requerido']"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model="purchase.invoice"
                  label="Factura *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Factura es requerida']"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-select
                  v-model="purchase.paymentMethod"
                  :options="paymentMethods"
                  label="Método de Pago *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Método de pago es requerido']"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-input
                  v-model="purchase.term"
                  type="number"
                  label="Plazo *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Plazo es requerido']"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-input
                  v-model="purchase.date"
                  type="date"
                  label="Fecha *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Fecha es requerida']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="selectedItemDisplay"
                  label="Artículo *"
                  outlined
                  dense
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="300"
                  @filter="filterItems"
                  @input-value="val => itemSearch = val"
                  @update:model-value="onItemSelect"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.code }} - {{ scope.opt.name }}</q-item-label>
                        <q-item-label caption>
                          <div class="row items-center text-primary">
                            <div class="col">Precio: {{ formatCurrency(scope.opt.price) }}</div>
                            <div class="col">Stock: {{ scope.opt.stock }}</div>
                          </div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-1">
                <q-input
                  v-model.number="currentItem.vat"
                  type="number"
                  label="IVA %"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-2">
                <q-input
                  v-model.number="currentItem.purchasePrice"
                  type="number"
                  label="Precio Compra"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-2">
                <q-input
                  v-model.number="currentItem.salePrice"
                  type="number"
                  label="Precio Venta"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-1">
                <q-input
                  v-model.number="currentItem.discount"
                  type="number"
                  label="Desc %"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-2">
                <q-input
                  v-model.number="currentItem.quantity"
                  type="number"
                  label="Cantidad *"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-1">
                <q-btn
                  color="primary"
                  icon="add"
                  @click="addItem"
                  class="full-width"
                  style="margin-top: 4px"
                  dense
                />
              </div>
            </div>

            <q-table
              title="Artículos"
              :rows="purchase.items"
              :columns="columns"
              row-key="id"
              dense
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    dense
                    color="negative"
                    icon="delete"
                    @click="removeItem(props.rowIndex)"
                  />
                </q-td>
              </template>
            </q-table>

            <div class="row justify-end q-gutter-sm">
              <div class="text-subtitle2">
                Subtotal: {{ formatCurrency(calculateSubtotal) }}
              </div>
              <div class="text-subtitle2">
                Descuento: {{ formatCurrency(calculateDiscount) }}
              </div>
              <div class="text-subtitle2">
                IVA: {{ formatCurrency(calculateVAT) }}
              </div>
              <div class="text-subtitle2">
                Total: {{ formatCurrency(calculateTotal) }}
              </div>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                label="Guardar"
                :loading="saving"
                icon="save"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const suppliers = ref<any[]>([]);
const items = ref<any[]>([]);
const saving = ref(false);
const itemSearch = ref('');

const paymentMethods = ['Efectivo', 'Tarjeta de Crédito', 'Transferencia'];

const purchase = ref({
  supplier: null,
  invoice: '',
  paymentMethod: null,
  term: 0,
  date: '',
  items: []
});

const currentItem = ref({
  item: null,
  vat: 0,
  purchasePrice: 0,
  salePrice: 0,
  discount: 0,
  quantity: 1
});

const selectedItemDisplay = computed(() => 
  currentItem.value.item ? `${currentItem.value.item.code} - ${currentItem.value.item.name}` : ''
);

const columns = [
  { name: 'item', label: 'Artículo', field: row => row.item.name, align: 'left' },
  { name: 'vat', label: 'IVA %', field: 'vat', align: 'right' },
  { name: 'purchasePrice', label: 'Precio Compra', field: 'purchasePrice', align: 'right' },
  { name: 'salePrice', label: 'Precio Venta', field: 'salePrice', align: 'right' },
  { name: 'discount', label: 'Descuento %', field: 'discount', align: 'right' },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'right' },
  { 
    name: 'subtotal', 
    label: 'Subtotal', 
    field: row => row.purchasePrice * row.quantity,
    format: val => formatCurrency(val),
    align: 'right'
  },
  { name: 'actions', label: 'Acciones', align: 'center' }
];

const calculateSubtotal = computed(() => {
  return purchase.value.items.reduce((sum, item) => {
    return sum + (item.purchasePrice * item.quantity);
  }, 0);
});

const calculateDiscount = computed(() => {
  return purchase.value.items.reduce((sum, item) => {
    return sum + (item.purchasePrice * item.quantity * item.discount / 100);
  }, 0);
});

const calculateVAT = computed(() => {
  return purchase.value.items.reduce((sum, item) => {
    const subtotal = item.purchasePrice * item.quantity;
    const afterDiscount = subtotal - (subtotal * item.discount / 100);
    return sum + (afterDiscount * item.vat / 100);
  }, 0);
});

const calculateTotal = computed(() => {
  return calculateSubtotal.value - calculateDiscount.value + calculateVAT.value;
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(value);
}

async function filterItems(val: string, update: (callback: () => void) => void) {
  if (val.length < 3) {
    update(() => {
      items.value = [];
    });
    return;
  }

  try {
    update(async () => {
      const response = await api.get(`/items?search=${val}`);
      items.value = response.data.map((item: any) => ({
        ...item,
        label: `${item.code} - ${item.name}`
      }));
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al buscar artículos',
      position: 'top'
    });
  }
}

function onItemSelect(item: any) {
  if (item) {
    currentItem.value.item = item;
    currentItem.value.purchasePrice = item.price || 0;
    currentItem.value.salePrice = item.price ? item.price * 1.3 : 0;
  }
}

function addItem() {
  if (currentItem.value.item) {
    purchase.value.items.push({ ...currentItem.value });
    currentItem.value = {
      item: null,
      vat: 0,
      purchasePrice: 0,
      salePrice: 0,
      discount: 0,
      quantity: 1
    };
    itemSearch.value = '';
  }
}

function removeItem(index: number) {
  purchase.value.items.splice(index, 1);
}

async function savePurchase() {
  try {
    saving.value = true;
    await api.post('/purchases', purchase.value);
    $q.notify({
      type: 'positive',
      message: 'Compra guardada exitosamente',
      position: 'top'
    });
    purchase.value = {
      supplier: null,
      invoice: '',
      paymentMethod: null,
      term: 0,
      date: '',
      items: []
    };
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `Error al guardar la compra: ${error.message}`,
      position: 'top'
    });
  } finally {
    saving.value = false;
  }
}

async function loadInitialData() {
  try {
    const [suppliersResponse] = await Promise.all([
      api.get('/suppliers')
    ]);
    suppliers.value = suppliersResponse.data || [];
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `Error al cargar datos iniciales: ${error.message}`,
      position: 'top'
    });
  }
}

loadInitialData();
</script>

<style lang="scss" scoped>
.q-table {
  .q-td {
    font-size: 12px;
  }
}

.text-h6 {
  font-size: 14px !important;
}
</style>
