<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="onClose" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md" ref="formRef">
          <q-input
            v-model="form.codigo"
            label="Código"
            :rules="[val => !!val || 'Código es requerido']"
            outlined
            :readonly="editMode"
            :disable="editMode"
          />

          <q-input
            v-model="form.nombre"
            label="Nombre"
            :rules="[val => !!val || 'Nombre es requerido']"
            outlined
          />

          <div class="row justify-end q-mt-md">
            <q-btn label="Cancelar" flat @click="onClose" class="q-mr-sm" />
            <q-btn
              label="Guardar"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Size } from '../domain/size.model';
import { QForm } from 'quasar';

const props = defineProps<{
  modelValue: boolean;
  size?: Size;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: Partial<Size>): void;
}>();

const formRef = ref<InstanceType<typeof QForm> | null>(null);
const form = ref({
  codigo: '',
  nombre: ''
});

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const editMode = computed(() => !!props.size);
const title = computed(() => props.size ? 'Editar Talla' : 'Nueva Talla');

const resetForm = () => {
  form.value = {
    codigo: '',
    nombre: ''
  };
  formRef.value?.reset();
};

const updateForm = (size: Size | undefined) => {
  if (size) {
    form.value = {
      codigo: size.codigo,
      nombre: size.nombre
    };
  } else {
    resetForm();
  }
};

watch(() => props.size, (newSize) => {
  updateForm(newSize);
}, { immediate: true });

const onSubmit = async () => {
  emit('submit', {
    codigo: form.value.codigo,
    nombre: form.value.nombre
  });
};

const onClose = () => {
  resetForm();
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
.q-card {
  max-width: 95vw;
}

.q-input {
  &--disabled {
    opacity: 0.7;
    
    .q-field__control {
      background: rgba(0, 0, 0, 0.03);
    }
  }
}

.body--dark {
  .q-input {
    &--disabled {
      .q-field__control {
        background: rgba(255, 255, 255, 0.03);
      }
    }
  }
}
</style>