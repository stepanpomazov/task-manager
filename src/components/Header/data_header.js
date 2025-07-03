export const fetchDepartmentTree = async () => {
    try {
        const response = await fetch('https://igpr25.tw1.ru/api/departments/tree');
        if (!response.ok) throw new Error('Ошибка загрузки дерева департаментов');
        const data = await response.json();

        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error('Ошибка:', error);
        return [{ id: '0', name: 'Все отделы', children: [] }]; // Fallback
    }
};