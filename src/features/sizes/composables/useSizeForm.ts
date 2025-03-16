import { reactive } from 'vue';
import type { Size } from '../domain/size.model';

export function useSizeForm(initialSize?: Size) {
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

  const updateForm = (size: Size | undefined) => {
    if (size) {
      form.id = size.id;
      form.codigo = size.codigo;
      form.nombre = size.nombre;
    } else {
      resetForm();
    }
  };

  if (initialSize) {
    updateForm(initialSize);
  }

  return {
    form,
    resetForm,
    updateForm
  };
}