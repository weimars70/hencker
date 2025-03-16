import { reactive } from 'vue';
import type { Group } from '../domain/group.model';

export function useGroupForm(initialGroup?: Group) {
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

  const updateForm = (group: Group | undefined) => {
    if (group) {
      form.id = group.id;
      form.codigo = group.codigo;
      form.nombre = group.nombre;
    } else {
      resetForm();
    }
  };

  if (initialGroup) {
    updateForm(initialGroup);
  }

  return {
    form,
    resetForm,
    updateForm
  };
}