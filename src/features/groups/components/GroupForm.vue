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
            v-if="editMode"
            v-model="form.codigo"
            label="Código"
            outlined
            dense
            readonly
            disable
          />

          <q-input
            v-model="form.nombre"
            label="Nombre"
            :rules="[val => !!val || 'Nombre es requerido']"
            outlined
            dense
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
import type { Group } from '../domain/group.model';
import { QForm } from 'quasar';

const props = defineProps<{
  modelValue: boolean;
  group?: Group;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: Partial<Group>): void;
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

const editMode = computed(() => !!props.group);
const title = computed(() => props.group ? 'Editar Grupo' : 'Nuevo Grupo');

const resetForm = () => {
  form.value = {
    codigo: '',
    nombre: ''
  };
  formRef.value?.reset();
};

const updateForm = (group: Group | undefined) => {
  if (group) {
    form.value = {
      codigo: group.codigo,
      nombre: group.nombre
    };
  } else {
    resetForm();
  }
};

watch(() => props.group, (newGroup) => {
  updateForm(newGroup);
}, { immediate: true });

const onSubmit = async () => {
  const submitData: Partial<Group> = {
    nombre: form.value.nombre
  };

  if (editMode.value) {
    submitData.codigo = form.value.codigo;
  }

  emit('submit', submitData);
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