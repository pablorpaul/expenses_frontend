import { useEffect, useState } from 'react';
import { categoriesService, expensesService } from '../../services/resourcesService';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/Expenses/Expenses.css";

const emptyForm = {
    title: '',
    amount: '',
    categoryId: '',
    date: '',
    description: ''
};

export default function Expenses() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editingExpense, setEditingExpense] = useState(null);
    const [detailExpense, setDetailExpense] = useState(null);
    const [message, setMessage] = useState('');

    async function loadData() {
        try {
            setLoading(true);

            const expensesData = await expensesService.list();
            const categoriesData = await categoriesService.list();

            setExpenses(expensesData);
            setCategories(categoriesData);
        } catch (error) {
            setMessage('Erro ao carregar os dados.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
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
        setEditingExpense(null);
    }

    function formatMoney(value) {
        if (!value) return 'R$ 0,00';
        return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            !form.title ||
            !form.amount ||
            !form.categoryId ||
            !form.date ||
            !form.description
        ) {
            setMessage('Preencha os campos obrigatórios.');
            return;
        }

        const payload = {
            title: form.title,
            amount: parseFloat(form.amount),
            categoryId: Number(form.categoryId),
            date: new Date(form.date),
            description: form.description,
            userId: user.id
        };

        try {
            if (editingExpense) {
                await expensesService.update(editingExpense.id, payload);
                setMessage('Despesa atualizada com sucesso.');
            } else {
                await expensesService.create(payload);
                setMessage('Despesa cadastrada com sucesso.');
            }
            clearForm();
            loadData();
        } catch (error) {
            setMessage('Erro ao salvar despesa.');
        }
    }

    function handleEdit(expense) {
        setEditingExpense(expense);
        setForm({
            title: expense.title || '',
            amount: String(expense.amount || ''),
            categoryId: expense.categoryId || '',
            date: expense.date || '',
            description: expense.description || ''
        });
    }

    async function handleDetails(expense) {
        try {
            const data = await expensesService.getById(expense.id);
            setDetailExpense(data);
        } catch (error) {
            setMessage('Erro ao carregar detalhes da despesa.');
        }
    }

    async function handleDelete(expense) {
        const confirmDelete = window.confirm(
            `Deseja excluir ${expense.title}?`
        );
        if (!confirmDelete) return;
        try {
            await expensesService.remove(expense.id);
            setMessage('Despesa excluída com sucesso.');
            loadData();
        } catch (error) {
            setMessage('Erro ao excluir despesa.');
        }
    }

    const filteredExpenses = expenses.filter((expense) => {
        const term = search.toLowerCase();
        return (
            expense.title?.toLowerCase().includes(term) ||
            expense.description?.toLowerCase().includes(term) ||
            expense.category?.name?.toLowerCase().includes(term) ||
            expense.amount?.toString().includes(term) ||
            expense.date?.toLowerCase().includes(term)
        );
    });

    if (loading) {
        return <p>Carregando despesas...</p>;
    }

    return (
        <MainLayout>
            <div className="expenses-container">
            
            {/* Cabeçalho da Página */}
            <div className="page-header">
                <h1>Despesas</h1>
                <p className="page-subtitle">Cadastre e acompanhe suas despesas.</p>
            </div>

            {/* Mensagens de Alerta com botão de fechar herdado */}
            {message && (
                <div className="alert-message">
                <span>{message}</span>
                <button className="btn-close-alert" onClick={() => setMessage('')}>×</button>
                </div>
            )}

            {/* Card de Cadastro / Edição */}
            <div className="expenses-card">
                <h2>{editingExpense ? 'Editar Despesa' : 'Nova Despesa'}</h2>
                <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="input-field">
                    <label>Titulo</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Almoço no restaurante X" />
                    </div>
                    
                    <div className="input-field">
                    <label>Valor</label>
                    <input name="amount" value={form.amount} onChange={handleChange} placeholder="Ex: 50.00" />
                    </div>
                    
                    <div className="input-field">
                    <label>Descrição</label>
                    <input name="description" value={form.description} onChange={handleChange} placeholder="Ex: Almoço no restaurante X" />
                    </div>
                    
                    <div className="input-field">
                    <label>Categoria</label>
                    <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    </div>
                    
                    <div className="input-field">
                    <label>Data </label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                    {editingExpense ? 'Salvar Alterações' : 'Cadastrar Despesa'}
                    </button>
                    {editingExpense && (
                    <button type="button" onClick={clearForm} className="btn-secondary">
                        Cancelar
                    </button>
                    )}
                </div>
                </form>
            </div>

            {/* Listagem de Despesas */}
            <div className="expenses-card">
                <div className="list-header">
                <h2>Lista de Despesas registradas</h2>
                <span className="badge-count">
                    {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa' : 'despesas'}
                </span>
                </div>

                <div className="search-box">
                <input
                    placeholder="Buscar por nome, espécie, raça ou tutor..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                </div>

                {loading ? (
                <div className="loading-container">Carregando dados das despesas...</div>
                ) : filteredExpenses.length === 0 ? (
                <div className="no-data">Nenhuma despesa encontrada com os critérios de busca.</div>
                ) : (
                <div className="table-wrapper">
                    <table className="expenses-table">
                    <thead>
                        <tr>
                        <th>Titulo</th>
                        <th>Valor</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Data</th>
                        <th style={{ textAlign: 'center' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense) => (
                        <tr key={expense.id}>
                            <td className="font-semibold">{expense.title}</td>
                            <td>{expense.amount?.toFixed(2) || '-'}</td>
                            <td>{expense.description}</td>
                            <td>{categories.find((cat) => cat.id === expense.categoryId)?.name || '-'}</td>
                            <td>{expense.date}</td>
                            <td>
                                <div className="table-actions">
                                    <button onClick={() => handleDetails(expense)} className="btn-action btn-info" title="Ver Detalhes">👁️</button>
                                    <button onClick={() => handleEdit(expense)} className="btn-action btn-edit" title="Editar">✏️</button>
                                    <button onClick={() => handleDelete(expense)} className="btn-action btn-danger" title="Excluir">🗑️</button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>

            {detailExpense && (
                <div className="details-overlay" onClick={() => setDetailExpense(null)}>
                <div className="details-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="list-header" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>Ficha Clínica: {detailExpense.title}</h2>
                    <button className="btn-close-alert" style={{ fontSize: '1.5rem' }} onClick={() => setDetailExpense(null)}>×</button>
                    </div>
                    
                    <div className="details-grid">
                        <p><strong>Titulo:</strong> {detailExpense.title}</p>
                        <p><strong>Valor:</strong> {detailExpense.amount?.toFixed(2) || '-'}</p>
                        <p><strong>Descrição:</strong> {detailExpense.description || '-'}</p>
                        <p><strong>Categoria:</strong> {categories.find((cat) => cat.id === detailExpense.categoryId)?.name || '-'}</p>
                        <p><strong>Data:</strong> {detailExpense.date}</p>
                    </div>

                    <button onClick={() => setDetailExpense(null)} className="btn-secondary full-width">
                    Fechar
                    </button>
                </div>
                </div>
            )}

            </div>
        </MainLayout>
    );
}

