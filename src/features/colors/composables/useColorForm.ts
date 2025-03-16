import { reactive } from 'vue';
import type { Color } from '../domain/color.model';

export function useColorForm(initialColor?: Color) {
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

  const updateForm = (color: Color | undefined) => {
    if (color) {
      form.id = color.id;
      form.codigo = color.codigo;
      form.nombre = color.nombre;
    } else {
      resetForm();
    }
  };

  if (initialColor) {
    updateForm(initialColor);
  }

  return {
    form,
    resetForm,
    updateForm
  };
}