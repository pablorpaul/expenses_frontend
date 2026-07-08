import { useEffect, useState } from 'react';
import { categoriesService } from '../../services/resourcesService';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/Categories/Categories.css"

const emptyForm = {
    name: '',
    description: ''
};

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editingCategory, setEditingCategory] = useState(null);
    const [detailCategory, setDetailCategory] = useState(null);
    const [message, setMessage] = useState('');

    async function loadCategories() {
        try {
            setLoading(true);
            const data = await categoriesService.list();
            setCategories(data);
        } catch (error) {
            setMessage('Erro ao carregar categorias.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    loadCategories();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value
        });
    }

    function clearForm() {
        setForm(emptyForm);
        setEditingCategory(null);
    }

    function clearMessage() {
        setMessage(null);
    }


    async function handleSubmit(event) {
        event.preventDefault();
        if (!form.name || !form.description) {
            setMessage('Preencha todos os campos.');
            return;
        }
        try {
            if (editingCategory) {
            await categoriesService.update(editingCategory.id, form);
            setMessage('Categoria atualizada com sucesso.');
        } else {
            await categoriesService.create(form);
            setMessage('Categoria cadastrada com sucesso.');
        }
            clearForm();
            loadCategories();
        } catch (error) {
            console.error(error);
            setMessage('Erro ao salvar categoria.');
        }
    }

    function handleEdit(category) {
        setEditingCategory(category);

        setForm({
            name: category.name || '',
            description: category.description || ''
        });
    }

    async function handleDetails(category) {
        try {
            const data = await categoriesService.getById(category.id);
            setDetailCategory(data);
        } catch (error) {
            setMessage('Erro ao carregar detalhes.');
        }
    }

    async function handleDelete(category) {
        const confirmDelete = window.confirm(`Deseja excluir ${category.name}?`);

        if (!confirmDelete) return;

        try {
            await categoriesService.remove(category.id);
            setMessage('Categoria excluída com sucesso.');
            loadCategories();
        } catch (error) {
            setMessage('Erro ao excluir categoria.');
        }
    }

    const filteredCategories = categories.filter((category) => {
        const term = search.toLowerCase();
        return (
            category.name?.toLowerCase().includes(term) ||
            category.description?.toLowerCase().includes(term)
        );
    });

    if (loading) {
    return <p>Carregando categorias...</p>;
    }

    return (
        <MainLayout>
            <div className="page-header">
                <div>
                    <h1>Gerenciamento de Categorias</h1>
                    <p className="page-subtitle">Gerencie as categorias dos gastos.</p>
                </div>
            </div>

            {message && (
                <div className="alert-message">
                    <span>{message}</span>
                    <button onClick={clearMessage} className="btn-close-alert">✕</button>
                </div>
            )}

            <div className="categories-card form-section">
                <h2>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                <form onSubmit={handleSubmit} className="categories-form">
                    <div className="form-grid">
                        <div className="input-field">
                            <label>Nome</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Ex: Alimentação" />
                        </div>
                        <div className="input-field">
                            <label>Descrição</label>
                            <input name="description" value={form.description} onChange={handleChange} placeholder="Descrição da categoria" />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingCategory ? 'Salvar alterações' : 'Cadastrar Categoria'}
                        </button>
                        {editingCategory && (
                            <button type="button" onClick={clearForm} className="btn-secondary">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Bloco da Tabela / Lista */}
            <div className="categories-card list-section">
                <div className="list-header">
                    <h2>Lista de Categorias</h2>
                    <span className="badge-count">Total: {categories.length}</span>
                </div>

                <div className="search-box">
                    <input
                        placeholder="Buscar por nome ou descrição..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                {filteredCategories.length === 0 ? (
                    <p className="no-data">Nenhuma categoria encontrada.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="categories-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="font-semibold">{category.name}</td>
                                        <td>{category.description}</td>
                                        <td className="table-actions">
                                            <button onClick={() => handleDetails(category)} className="btn-action btn-info" title="Detalhes">👁️</button>
                                            <button onClick={() => handleEdit(category)} className="btn-action btn-edit" title="Editar">✏️</button>
                                            <button onClick={() => handleDelete(category)} className="btn-action btn-danger" title="Excluir">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Painel Lateral / Modal de Detalhes */}
            {detailCategory && (
                <div className="details-overlay">
                    <div className="details-modal">
                        <h2>Detalhes da Categoria</h2>
                        <div className="details-grid">
                            <p><strong>Nome:</strong> {detailCategory.name}</p>
                            <p><strong>Descrição:</strong> {detailCategory.description}</p>
                        </div>
                        <button onClick={() => setDetailCategory(null)} className="btn-primary full-width">
                            Fechar detalhes
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}


