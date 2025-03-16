import { ref, onMounted, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import type { TreeNode, Role } from '../domain/menu.model';
import { MenuApi } from '../infrastructure/menu.api';

export function useTreeLogic() {
  const $q = useQuasar();
  const menuRepository = new MenuApi();
  
  const treeData = ref<TreeNode[]>([]);
  const selectedItems = ref<string[]>([]);
  const expandedNodes = ref<string[]>([]);
  const saving = ref(false);
  const roles = ref<Role[]>([]);
  const selectedRole = ref<number | null>(null);
  const loadingRoles = ref(false);

  const processNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map(node => ({
      ...node,
      label: node.name || node.label,
      tickable: true,
      children: node.children ? processNodes(node.children) : []
    }));
  };

  const loadTreeData = async () => {
    try {
      const response = await menuRepository.getMenuItems();
      console.log('Raw tree data:', response);
      
      const parsedData = typeof response === 'string' ? JSON.parse(response) : response;
      treeData.value = processNodes(parsedData);
      
      console.log('Processed tree data:', treeData.value);
      
      expandAllNodes(treeData.value);
      await nextTick();
    } catch (error) {
      console.error('Error loading tree data:', error);
      $q.notify({ 
        type: 'negative', 
        message: 'Error al cargar datos del árbol',
        position: 'center'
      });
    }
  };

  const expandAllNodes = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        expandedNodes.value.push(node.path);
        expandAllNodes(node.children);
      }
    });
  };

  const getAllPaths = (nodes: TreeNode[]): string[] => {
    let paths: string[] = [];
    nodes.forEach(node => {
      paths.push(node.path);
      if (node.children && node.children.length > 0) {
        paths = paths.concat(getAllPaths(node.children));
      }
    });
    return paths;
  };

  const getAllDescendantPaths = (node: TreeNode): string[] => {
    let paths: string[] = [];
    if (node.children) {
      node.children.forEach(child => {
        paths.push(child.path);
        paths = paths.concat(getAllDescendantPaths(child));
      });
    }
    return paths;
  };

  const getAllParentPaths = (nodes: TreeNode[], targetPath: string, path: string[] = []): string[] => {
    for (const node of nodes) {
      if (node.path === targetPath) {
        return path;
      }
      if (node.children) {
        const newPath = [...path, node.path];
        const found = getAllParentPaths(node.children, targetPath, newPath);
        if (found.length > 0) {
          return found;
        }
      }
    }
    return [];
  };

  const findNodeByPath = (nodes: TreeNode[], path: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = findNodeByPath(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const updateSelection = (ticked: string[]) => {
    const previousSelection = new Set(selectedItems.value);
    const currentSelection = new Set(ticked);
    
    let changedPath: string | undefined;
    for (const path of previousSelection) {
      if (!currentSelection.has(path)) {
        changedPath = path;
        break;
      }
    }
    if (!changedPath) {
      for (const path of currentSelection) {
        if (!previousSelection.has(path)) {
          changedPath = path;
          break;
        }
      }
    }

    if (changedPath) {
      const node = findNodeByPath(treeData.value, changedPath);
      if (node) {
        const wasUnchecked = !currentSelection.has(changedPath);
        
        if (wasUnchecked) {
          // When unchecking, remove the node and all its descendants
          const descendantPaths = getAllDescendantPaths(node);
          selectedItems.value = selectedItems.value.filter(path => 
            !descendantPaths.includes(path) && path !== changedPath
          );
        } else {
          // When checking, add all parent nodes
          const parentPaths = getAllParentPaths(treeData.value, changedPath);
          const newSelection = new Set([
            ...ticked,
            ...parentPaths
          ]);
          selectedItems.value = Array.from(newSelection);
        }
      }
    }
  };

  const loadRoles = async () => {
    loadingRoles.value = true;
    try {
      roles.value = await menuRepository.getRoles();
    } catch (error) {
      console.error('Error loading roles:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al cargar roles',
        position: 'center'
      });
    } finally {
      loadingRoles.value = false;
    }
  };

  const onRoleChange = async (roleId: number) => {
    if (!roleId) return;
    try {
      // Get the role permissions
      const rolePermissions = await menuRepository.getMenuRol(roleId);
      console.log('Role permissions:', rolePermissions);

      // If permissions are empty or null, only check the "/inicio" node
      if (!rolePermissions || (Array.isArray(rolePermissions) && rolePermissions.length === 0)) {
        console.log('No permissions found, setting default permissions');
        selectedItems.value = ['/'];
        return;
      }

      // Parse the permissions if it's a string
      const parsedPermissions = typeof rolePermissions === 'string' 
        ? JSON.parse(rolePermissions) 
        : rolePermissions;

      // Get all paths from the permissions tree
      const permissionPaths = getAllPaths(parsedPermissions);
      console.log('Permission paths:', permissionPaths);

      // Update selected items
      selectedItems.value = permissionPaths;

    } catch (error) {
      console.error('Error loading role menu:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al cargar menú del rol',
        position: 'center'
      });
      // Set default permission on error
      selectedItems.value = ['/'];
    }
  };

  const getSelectedNodesData = (): TreeNode[] => {
    const selectedNodes: TreeNode[] = [];
    
    selectedItems.value.forEach(path => {
      const node = findNodeByPath(treeData.value, path);
      if (node) {
        const nodeWithChildren = {
          path: node.path,
          label: node.label,
          icon: node.icon,
          children: []
        };
        
        if (node.children) {
          nodeWithChildren.children = node.children
            .filter(child => selectedItems.value.includes(child.path))
            .map(child => ({
              path: child.path,
              label: child.label,
              icon: child.icon,
              children: child.children 
                ? child.children
                    .filter(grandChild => selectedItems.value.includes(grandChild.path))
                    .map(grandChild => ({
                      path: grandChild.path,
                      label: grandChild.label,
                      icon: grandChild.icon,
                      children: []
                    }))
                : []
            }));
        }
        
        selectedNodes.push(nodeWithChildren);
      }
    });

    return selectedNodes;
  };

  const saveSelection = async () => {
    if (!selectedRole.value) {
      $q.notify({
        type: 'warning',
        message: 'Por favor seleccione un rol',
        position: 'center'
      });
      return;
    }

    saving.value = true;
    try {
      const selectedTree = getSelectedNodesData();
      await menuRepository.saveMenuRol(selectedRole.value, selectedTree);
      
      $q.notify({
        type: 'positive',
        message: 'Selección guardada exitosamente',
        position: 'center'
      });
    } catch (error) {
      console.error('Error saving selection:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al guardar la selección',
        position: 'center'
      });
    } finally {
      saving.value = false;
    }
  };

  onMounted(async () => {
    await loadTreeData();
    await loadRoles();
  });

  return {
    treeData,
    selectedItems,
    expandedNodes,
    updateSelection,
    saving,
    saveSelection,
    getSelectedNodesData,
    roles,
    selectedRole,
    loadingRoles,
    onRoleChange
  };
}