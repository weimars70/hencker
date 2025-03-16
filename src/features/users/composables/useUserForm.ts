import { reactive, watch, ref } from 'vue';
import type { User } from '../domain/user.model';
import { menuService } from 'src/services/menuServices';

export function useUserForm(initialUser?: User) {
  const form = reactive({
    id: undefined as number | undefined,
    nombre: '',
    email: '',
    clave: '',
    confirmClave: '',
    rol: null as number | null
  });

  const roles = ref([]);
  const loadingRoles = ref(false);

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

  const emailRules = [
    (val: string) => !!val || 'Email es requerido',
    (val: string) => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email inválido'
  ];

  const claveRules = [
    (val: string) => {
      if (!initialUser) {
        if (!val) return 'Clave es requerida';
        if (val.length < 5) return 'La clave debe tener al menos 5 caracteres';
        if (!/[A-Z]/.test(val)) return 'La clave debe contener al menos una mayúscula';
        if (!/[0-9]/.test(val)) return 'La clave debe contener al menos un número';
      }
      return true;
    }
  ];

  const confirmClaveRules = [
    (val: string) => {
      if (!initialUser) {
        if (!val) return 'Confirmar clave es requerida';
        if (val !== form.clave) return 'Las claves no coinciden';
      }
      return true;
    }
  ];

  const resetForm = () => {
    form.id = undefined;
    form.nombre = '';
    form.email = '';
    form.clave = '';
    form.confirmClave = '';
    form.rol = null;
  };

  const updateForm = (user: User | undefined) => {
    if (user) {
      form.id = user.id;
      form.nombre = user.nombre;
      form.email = user.email;
      form.rol = user.rol || null;
      form.clave = '';
      form.confirmClave = '';
    } else {
      resetForm();
    }
  };

  watch(() => initialUser, updateForm, { immediate: true });

  loadRoles();

  return {
    form,
    roles,
    loadingRoles,
    emailRules,
    claveRules,
    confirmClaveRules,
    resetForm,
    updateForm
  };
}