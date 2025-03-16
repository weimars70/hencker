<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="onClose" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-if="color"
            v-model="form.codigo"
            label="Código"
            readonly
            outlined
            disable
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
import { computed, watch } from 'vue';
import { useColorForm } from '../composables/useColorForm';
import type { Color } from '../domain/color.model';

const props = defineProps<{
  modelValue: boolean;
  color?: Color;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: Partial<Color>): void;
}>();

const { form, resetForm, updateForm } = useColorForm(props.color);

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const title = computed(() => props.color ? 'Editar Color' : 'Nuevo Color');

watch(() => props.color, (newColor) => {
  updateForm(newColor);
}, { immediate: true });

const onSubmit = () => {
  emit('submit', {
    codigo: form.codigo,
    nombre: form.nombre
  });
};

const onClose = () => {
  resetForm();
  emit('update:modelValue', false);
};
</script>