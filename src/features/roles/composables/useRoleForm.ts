import { reactive } from 'vue';
import type { Role } from '../domain/role.model';

export function useRoleForm(initialRole?: Role) {
  const form = reactive({
    id: undefined as number | undefined,
    codigo: '',
    nombre: ''
  });

  const resetForm = () => {
    form.id = undefined;
    form.codigo = '';
    form.nombre = '';
  };

  const updateForm = (role: Role | undefined) => {
    if (role) {
      form.id = role.id;
      form.codigo = role.codigo;
      form.nombre = role.nombre;
    } else {
      resetForm();
    }
  };

  if (initialRole) {
    updateForm(initialRole);
  }

  return {
    form,
    resetForm,
    updateForm
  };
}