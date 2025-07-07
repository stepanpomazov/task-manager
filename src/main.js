import { renderHeader } from './components/Header/header.js';
import { renderTable } from './components/Table/table.js';
import { renderModal } from './components/Employee-model/employee-model.js';

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderTable();
    renderModal();
    
});