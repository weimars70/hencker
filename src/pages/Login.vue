<template>
  <div class="login-page">
    <div class="login-container">
      <q-card class="login-card">
        <q-card-section class="text-center q-pb-none">
          <div class="login-images q-mb-md">
            <div class="image-container">
              <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
                spinner-color="primary"
                class="person-image"
                width="120px"
                height="120px"
                fit="cover"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center text-negative">
                    Error al cargar imagen
                  </div>
                </template>
                <template v-slot:loading>
                  <q-spinner-dots color="primary" />
                </template>
              </q-img>
              <q-img
                src="https://cdn.quasar.dev/img/parallax1.jpg"
                spinner-color="primary"
                class="shoe-image"
                width="120px"
                height="120px"
                fit="cover"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center text-negative">
                    Error al cargar imagen
                  </div>
                </template>
                <template v-slot:loading>
                  <q-spinner-dots color="primary" />
                </template>
              </q-img>
            </div>
          </div>
          <div class="text-h5 text-weight-bold text-primary q-mb-md">Sistema ERP</div>
          <div class="text-subtitle2 text-grey-7">Iniciar Sesión</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.username"
              label="Usuario"
              outlined
              dense
              :rules="[val => !!val || 'Usuario es requerido']"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              label="Contraseña"
              outlined
              dense
              :type="showPassword ? 'text' : 'password'"
              :rules="[val => !!val || 'Contraseña es requerida']"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="primary"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-select
              v-model="selectedBranch"
              :options="branches"
              label="Sucursal"
              outlined
              dense
              emit-value
              map-options
              :rules="[val => !!val || 'Sucursal es requerida']"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-icon name="business" color="primary" />
              </template>
            </q-select>

            <div class="row items-center justify-between q-mt-md">
              <q-checkbox v-model="rememberMe" label="Recordarme" dense color="primary" :disable="loading" />
              <q-btn flat dense color="primary" label="¿Olvidó su contraseña?" :disable="loading" />
            </div>

            <q-btn
              type="submit"
              color="primary"
              class="full-width"
              label="Iniciar Sesión"
              :loading="loading"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();

const form = ref({
  username: '',
  password: ''
});

const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const selectedBranch = ref('main');

const branches = [
  { label: 'Principal', value: 'main' },
  { label: 'Sucursal 1', value: 'branch1' },
  { label: 'Sucursal 2', value: 'branch2' }
];

async function onSubmit() {
  try {
    loading.value = true;
    
    await auth.login({
      username: form.value.username, password: form.value.password,
      sucursal: 0,
      rol: 0
    });
    
    // Set selected branch
    auth.setBranch(selectedBranch.value);
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: 'Inicio de sesión exitoso',
      position: 'center'
    });

    // Redirect to home page
    router.push('/');
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al iniciar sesión',
      position: 'center'
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #e5e7e9;
  
  .q-card__section {
    padding: 32px;
  }
}

.login-images {
  display: flex;
  justify-content: center;
  align-items: center;
  
  .image-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 32px;
  }
  
  .person-image, .shoe-image {
    border-radius: 12px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .shoe-image {
    transform: rotate(-15deg);
  }
}

.body--dark {
  .login-card {
    background: #e5e7e9;
  }
  
  .login-images {
    .person-image, .shoe-image {
      background: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>