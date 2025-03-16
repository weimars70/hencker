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
          <!-- ID Field - Only shown when editing -->
          <q-input
            v-if="editMode"
            v-model="form.id"
            label="ID"
            readonly
            outlined
            dense
            disable
          />

          <!-- Usuario Field -->
          <q-input
            v-model="form.usuario"
            label="Usuario"
            :rules="[val => !!val || 'Usuario es requerido']"
            outlined
            dense
            :readonly="editMode"
            :disable="editMode"
          />

          <!-- Nombre Field -->
          <q-input
            v-model="form.nombre"
            label="Nombre"
            :rules="[val => !!val || 'Nombre es requerido']"
            outlined
            dense
          />

          <!-- Email Field -->
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            :rules="emailRules"
            outlined
            dense
          />

          <!-- Rol Field - Shown for both create and edit -->
          <q-select
            v-model="form.rol"
            :options="roles"
            option-label="nombre"
            option-value="codigo"
            label="Rol"
            :loading="loadingRoles"
            :rules="[val => !!val || 'Rol es requerido']"
            outlined
            dense
            emit-value
            map-options
          />

          <!-- Password Fields - Only shown when creating -->
          <template v-if="!editMode">
            <q-input
              v-model="form.clave"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              :rules="claveRules"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-input
              v-model="form.confirmClave"
              label="Confirmar Contraseña"
              :type="showPassword ? 'text' : 'password'"
              :rules="confirmClaveRules"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </template>

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
import { QForm } from 'quasar';
import { menuService } from 'src/services/menuServices';
import type { User } from '../domain/user.model';

const props = defineProps<{
  modelValue: boolean;
  user?: User;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: Partial<User>): void;
}>();

const formRef = ref<InstanceType<typeof QForm> | null>(null);
const showPassword = ref(false);
const roles = ref([]);
const loadingRoles = ref(false);

const form = ref({
  id: undefined as number | undefined,
  usuario: '',
  nombre: '',
  email: '',
  rol: null as number | null,
  clave: '',
  confirmClave: ''
});

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const editMode = computed(() => !!props.user);
const title = computed(() => editMode.value ? 'Editar Usuario' : 'Nuevo Usuario');

const emailRules = [
  (val: string) => !!val || 'Email es requerido',
  (val: string) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email inválido'
];

const claveRules = [
  (val: string) => {
    if (!editMode.value) {
      if (!val) return 'Contraseña es requerida';
      if (val.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
      if (!/[A-Z]/.test(val)) return 'La contraseña debe contener al menos una mayúscula';
      if (!/[0-9]/.test(val)) return 'La contraseña debe contener al menos un número';
    }
    return true;
  }
];

const confirmClaveRules = [
  (val: string) => {
    if (!editMode.value) {
      if (!val) return 'Confirmar contraseña es requerida';
      if (val !== form.value.clave) return 'Las contraseñas no coinciden';
    }
    return true;
  }
];

const resetForm = () => {
  form.value = {
    id: undefined,
    usuario: '',
    nombre: '',
    email: '',
    rol: null,
    clave: '',
    confirmClave: ''
  };
  formRef.value?.reset();
};

const updateForm = (user: User | undefined) => {
  if (user) {
    form.value = {
      id: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      clave: '',
      confirmClave: ''
    };
  } else {
    resetForm();
  }
};

const loadRoles = async () => {
  loadingRoles.value = true;
  try {
    roles.value = await menuService.getRoles();
  } catch (error) {
    console.error('Error loading roles:', error);
  } finally {
    loadingRoles.value = false;
  }
};

watch(() => props.user, (newUser) => {
  updateForm(newUser);
}, { immediate: true });

const onSubmit = async () => {
  const submitData: Partial<User> = {
    nombre: form.value.nombre,
    email: form.value.email,
    rol: form.value.rol
  };

  if (editMode.value) {
    submitData.id = form.value.id;
  } else {
    submitData.usuario = form.value.usuario;
    submitData.clave = form.value.clave;
  }

  emit('submit', submitData);
};

const onClose = () => {
  resetForm();
  emit('update:modelValue', false);
};

loadRoles();
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