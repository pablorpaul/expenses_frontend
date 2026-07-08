import { useState, useEffect } from "react"
import { categoriesService, expensesService } from "../../services/resourcesService"
import MainLayout from "../../layouts/MainLayout"
import "../../styles/Dashboard/Dashboard.css"

function Dashboard(){
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [count, setCount] = useState(0)
    const [categories, setCategories] = useState([])

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

    async function loadDashboardData() {
        try {
            setLoading(true);
            const totalData = await expensesService.calculateTotal();
            const countData = await expensesService.count();

            setTotal(totalData);
            setCount(countData);
        } catch (error) {
            setMessage('Erro ao carregar dados do dashboard.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    loadCategories();
    loadDashboardData();
    }, []);
    
    if (loading) {
    return <p>Carregando ...</p>;
    }

    return (
    <MainLayout>
        <div className="page-header">
            <div>
                <h1>Dashboard</h1>
                <p className="page-subtitle">Visão geral dos gastos.</p>
            </div>
        </div>

        {loading ? (
            <div className="loading-text">Carregando dados...</div>
        ) : (
            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h2>Total de Despesas</h2>
                    <p>R$ {total?.total ?? "0,00"}</p>
                </div>
                <div className="dashboard-card">
                    {/* Corrigido o título para refletir a contagem */}
                    <h2>Quantidade de Despesas</h2> 
                    <p>{count?.count ?? 0}</p>
                </div>
            </div>
        )}
    </MainLayout>
)
}

export default Dashboard