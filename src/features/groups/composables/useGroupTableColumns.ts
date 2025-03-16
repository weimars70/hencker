import type { QTableColumn } from 'quasar';

export function useGroupTableColumns(): QTableColumn[] {
  return [
    {
      name: 'codigo',
      required: true,
      label: 'Código',
      align: 'left',
      field: 'codigo',
      sortable: true
    },
    {
      name: 'nombre',
      required: true,
      label: 'Nombre',
      align: 'left',
      field: 'nombre',
      sortable: true
    },
    {
      name: 'actions',
      required: true,
      label: 'Acciones',
      align: 'center',
      field: 'actions'
    }
  ];
}